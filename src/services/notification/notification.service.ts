import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { prisma } from '../../config/database.js';
import type { CommandeWithRelations } from '../../repository/order.repository.js';
import { emailChannel } from './email.channel.js';
import { whatsappChannel } from './whatsapp.channel.js';
import {
  gabaritNouvelleCommande,
  gabaritStatutCommande,
} from './templates/order.template.js';
import {
  gabaritReinitialisationMotDePasse,
  gabaritMotDePasseModifie,
} from './templates/passwordReset.template.js';
import type {
  CanalEnvoi,
  ContenuNotification,
  DestinatairesNotification,
  ResultatNotification,
} from './channel.types.js';

/**
 * Orchestrateur des notifications.
 *
 * Responsabilités :
 *   1. choisir le canal disponible (WhatsApp prioritaire, email en repli) ;
 *   2. réessayer en cas d'échec transitoire, avec attente croissante ;
 *   3. tracer le résultat pour qu'aucun échec ne reste invisible.
 *
 * ORDRE DE PRIORITÉ DES CANAUX
 * ----------------------------
 * WhatsApp d'abord, email ensuite. Tant que la configuration Telnyx n'est
 * pas faite côté plateforme, `whatsappChannel.estConfigure()` renvoie
 * `false` et tout part automatiquement par email. Le jour où WhatsApp est
 * activé, il suffit de renseigner les variables d'environnement : aucun
 * code ne change.
 */

const NOMBRE_TENTATIVES = 3;
const DELAI_INITIAL_MS = 500;

/** Canaux par ordre de préférence. */
const CANAUX: readonly CanalEnvoi[] = [whatsappChannel, emailChannel];

/** Attente passive, utilisée entre deux tentatives. */
const attendre = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class NotificationService {
  /**
   * Sélectionne le premier canal à la fois configuré ET capable de
   * joindre ce destinataire.
   *
   * Le double test est important : le canal WhatsApp peut être configuré
   * alors que ce client précis n'a pas de téléphone renseigné — il faut
   * alors continuer vers l'email plutôt qu'échouer.
   */
  static choisirCanal(destinataires: DestinatairesNotification): {
    canal: CanalEnvoi;
    adresse: string;
  } | null {
    for (const canal of CANAUX) {
      if (!canal.estConfigure()) continue;
      const adresse = canal.resoudreDestinataire(destinataires);
      if (adresse) return { canal, adresse };
    }
    return null;
  }

  /**
   * Envoie un message avec reprise (retry) à attente exponentielle :
   * 500 ms, puis 1 s, puis 2 s.
   *
   * Pourquoi une attente croissante ? Un service tiers momentanément
   * saturé se rétablit en quelques secondes. Réessayer immédiatement en
   * boucle aggrave sa charge ; espacer les tentatives lui laisse le temps
   * de repartir, sans bloquer l'appelant longtemps.
   *
   * Cette méthode ne lève jamais d'exception : elle retourne un résultat.
   * L'appelant décide quoi en faire (tracer, alerter, ignorer).
   */
  static async envoyer(
    destinataires: DestinatairesNotification,
    contenu: ContenuNotification,
    contexte: Record<string, unknown> = {}
  ): Promise<ResultatNotification> {
    const selection = this.choisirCanal(destinataires);

    if (!selection) {
      const erreur =
        "Aucun canal de notification disponible (ni WhatsApp configuré, ni email joignable).";
      logger.warn({ ...contexte, destinataires }, erreur);
      return { succes: false, canal: null, tentatives: 0, erreur };
    }

    const { canal, adresse } = selection;
    let derniereErreur = '';

    for (let tentative = 1; tentative <= NOMBRE_TENTATIVES; tentative++) {
      try {
        await canal.envoyer(adresse, contenu);
        logger.info(
          { ...contexte, canal: canal.nom, tentative },
          'Notification envoyée'
        );
        return { succes: true, canal: canal.nom, tentatives: tentative };
      } catch (error) {
        derniereErreur = error instanceof Error ? error.message : String(error);
        logger.warn(
          { ...contexte, canal: canal.nom, tentative, erreur: derniereErreur },
          'Échec de notification, nouvelle tentative'
        );

        if (tentative < NOMBRE_TENTATIVES) {
          await attendre(DELAI_INITIAL_MS * 2 ** (tentative - 1));
        }
      }
    }

    logger.error(
      { ...contexte, canal: canal.nom, erreur: derniereErreur },
      'Notification définitivement en échec'
    );

    return {
      succes: false,
      canal: canal.nom,
      tentatives: NOMBRE_TENTATIVES,
      erreur: derniereErreur,
    };
  }

  // ------------------------------------------------------------------
  // Cas d'usage métier
  // ------------------------------------------------------------------

  /**
   * Prévient le vendeur d'une nouvelle commande, puis inscrit le résultat
   * dans la commande elle-même.
   *
   * Persister l'état transforme un effet de bord volatil en donnée : le
   * dashboard peut afficher « commande non notifiée » et proposer un
   * renvoi. Sans cela, une panne du fournisseur reste invisible.
   */
  static async notifierVendeurNouvelleCommande(
    commande: CommandeWithRelations
  ): Promise<ResultatNotification> {
    const contenu = gabaritNouvelleCommande(commande);

    const resultat = await this.envoyer(
      {
        telephone: env.VENDOR_WHATSAPP_NUMBER,
        email: env.VENDOR_EMAIL,
      },
      contenu,
      { commandeId: commande.id, numeroCommande: commande.numeroCommande }
    );

    await this.tracerResultat(commande.id, resultat);
    return resultat;
  }

  /** Prévient le client du passage de sa commande en livrée ou annulée. */
  static async notifierClientStatutCommande(
    commande: CommandeWithRelations & { emailClient?: string | null },
    statut: 'LIVREE' | 'ANNULEE'
  ): Promise<ResultatNotification> {
    const contenu = gabaritStatutCommande(commande, statut);

    return this.envoyer(
      {
        telephone: commande.utilisateur?.telephone ?? commande.telephoneClient,
        email: commande.emailClient ?? commande.utilisateur?.email ?? null,
      },
      contenu,
      { commandeId: commande.id, numeroCommande: commande.numeroCommande, statut }
    );
  }

  /**
   * Envoie le lien de réinitialisation de mot de passe.
   * Toujours par email, jamais par WhatsApp (voir le gabarit).
   */
  static async envoyerLienReinitialisation(options: {
    email: string;
    nomComplet: string;
    lien: string;
    dureeValiditeMinutes: number;
  }): Promise<ResultatNotification> {
    if (!emailChannel.estConfigure()) {
      const erreur = 'Canal email non configuré : impossible d’envoyer le lien de réinitialisation.';
      logger.error({}, erreur);
      return { succes: false, canal: null, tentatives: 0, erreur };
    }

    const contenu = gabaritReinitialisationMotDePasse(options);

    try {
      await emailChannel.envoyer(options.email, contenu);
      logger.info({ canal: 'email' }, 'Lien de réinitialisation envoyé');
      return { succes: true, canal: 'email', tentatives: 1 };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error({ erreur: message }, "Échec de l'envoi du lien de réinitialisation");
      return { succes: false, canal: 'email', tentatives: 1, erreur: message };
    }
  }

  /** Confirme au client que son mot de passe a bien été changé. */
  static async confirmerChangementMotDePasse(
    email: string | null | undefined,
    nomComplet: string
  ): Promise<void> {
    if (!email || !emailChannel.estConfigure()) return;

    const contenu = gabaritMotDePasseModifie(nomComplet);
    try {
      await emailChannel.envoyer(email, contenu);
    } catch (error) {
      // Non bloquant : l'utilisateur a déjà changé son mot de passe avec
      // succès, l'échec de cet email de courtoisie ne doit rien casser.
      logger.warn(
        { erreur: error instanceof Error ? error.message : String(error) },
        "Échec de l'email de confirmation de changement de mot de passe"
      );
    }
  }

  /** Inscrit le résultat d'une notification sur la commande concernée. */
  private static async tracerResultat(
    commandeId: number,
    resultat: ResultatNotification
  ): Promise<void> {
    try {
      await prisma.commande.update({
        where: { id: commandeId },
        data: {
          notificationEnvoyee: resultat.succes,
          notificationCanal: resultat.canal,
          notificationTentatives: resultat.tentatives,
          notificationErreur: resultat.erreur ?? null,
          notificationEnvoyeeLe: resultat.succes ? new Date() : null,
        },
      });
    } catch (error) {
      // La traçabilité ne doit jamais faire échouer le flux principal.
      logger.error(
        { commandeId, erreur: error instanceof Error ? error.message : String(error) },
        "Impossible d'enregistrer l'état de notification"
      );
    }
  }
}
