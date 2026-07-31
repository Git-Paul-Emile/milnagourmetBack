import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';
import { NotificationService } from './notification/notification.service.js';

/**
 * Réinitialisation de mot de passe par email.
 *
 * DÉROULÉ COMPLET
 * ---------------
 *   1. Le client saisit son email sur /mot-de-passe-oublie.
 *   2. Le serveur génère un jeton aléatoire de 32 octets, en stocke le
 *      HASH en base, et envoie le jeton en clair dans un lien par email.
 *   3. Le client ouvre le lien, saisit un nouveau mot de passe.
 *   4. Le serveur re-hache le jeton reçu, le compare à celui stocké,
 *      vérifie qu'il n'est ni expiré ni déjà utilisé, puis remplace le
 *      mot de passe et incrémente `tokenVersion`.
 *
 * TROIS DÉCISIONS DE SÉCURITÉ
 * ---------------------------
 * 1) On ne stocke que le HASH du jeton. Un jeton de réinitialisation vaut
 *    un mot de passe temporaire : si la base fuite, les jetons en cours
 *    ne doivent pas être exploitables.
 *
 * 2) La réponse à /forgot-password est TOUJOURS identique, que le compte
 *    existe ou non. Sinon l'endpoint devient un oracle permettant de
 *    savoir qui est client (énumération de comptes).
 *
 * 3) `tokenVersion` est incrémenté après le changement : cela invalide
 *    tous les refresh tokens existants. Si un attaquant avait une session
 *    ouverte, elle tombe au moment où le vrai propriétaire reprend la main.
 */

/** Durée de validité du lien. Assez court pour limiter l'exposition. */
const DUREE_VALIDITE_MINUTES = 30;

/** Coût du hachage bcrypt, aligné sur le reste de l'application. */
const COUT_BCRYPT = env.BCRYPT_SALT;

/**
 * Hache un jeton avec SHA-256.
 *
 * Pourquoi SHA-256 ici alors qu'on utilise bcrypt pour les mots de passe ?
 * Parce que bcrypt est volontairement LENT pour résister aux attaques par
 * force brute sur des secrets faibles (un mot de passe humain). Un jeton
 * de 256 bits tiré au hasard n'est pas devinable par force brute : un
 * hachage rapide suffit, et évite d'ajouter 100 ms à chaque vérification.
 */
function hacherJeton(jeton: string): string {
  return createHash('sha256').update(jeton).digest('hex');
}

export class PasswordResetService {
  /**
   * Étape 1 — demande de réinitialisation.
   *
   * Ne lève jamais d'erreur « compte introuvable » : le contrôleur
   * renvoie systématiquement le même message de succès.
   */
  static async demanderReinitialisation(email: string): Promise<void> {
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });

    // Compte inexistant ou bloqué : on s'arrête en silence.
    // Le log garde la trace côté serveur pour le support.
    if (!utilisateur || utilisateur.blocked) {
      logger.info(
        { email, trouve: Boolean(utilisateur) },
        'Demande de réinitialisation pour un compte inexistant ou bloqué'
      );
      return;
    }

    // Invalide les demandes précédentes encore actives : un seul lien
    // valide à la fois évite qu'un ancien email retrouvé dans la boîte
    // serve à reprendre la main plus tard.
    await prisma.jetonReinitialisation.updateMany({
      where: { utilisateurId: utilisateur.id, utiliseLe: null },
      data: { utiliseLe: new Date() },
    });

    // 32 octets d'entropie cryptographique : impossible à deviner.
    const jetonEnClair = randomBytes(32).toString('hex');
    const expireLe = new Date(Date.now() + DUREE_VALIDITE_MINUTES * 60 * 1000);

    await prisma.jetonReinitialisation.create({
      data: {
        utilisateurId: utilisateur.id,
        tokenHash: hacherJeton(jetonEnClair),
        expireLe,
      },
    });

    const lien = `${env.PUBLIC_APP_URL}/reinitialiser-mot-de-passe?token=${jetonEnClair}`;

    const resultat = await NotificationService.envoyerLienReinitialisation({
      email,
      nomComplet: utilisateur.nomComplet,
      lien,
      dureeValiditeMinutes: DUREE_VALIDITE_MINUTES,
    });

    if (!resultat.succes) {
      // On journalise en erreur mais on ne remonte rien au client :
      // révéler l'échec d'envoi confirmerait l'existence du compte.
      logger.error(
        { utilisateurId: utilisateur.id, erreur: resultat.erreur },
        "Échec de l'envoi du lien de réinitialisation"
      );
    }
  }

  /**
   * Étape 2 — application du nouveau mot de passe.
   *
   * Ici, à l'inverse de l'étape 1, les erreurs sont explicites : la
   * personne détient déjà le lien, lui dire qu'il a expiré est utile et
   * ne révèle rien d'exploitable.
   */
  static async reinitialiser(jetonEnClair: string, nouveauMotDePasse: string): Promise<void> {
    const jeton = await prisma.jetonReinitialisation.findUnique({
      where: { tokenHash: hacherJeton(jetonEnClair) },
      include: { utilisateur: true },
    });

    if (!jeton) {
      throw new AppError('Lien de réinitialisation invalide.', StatusCodes.BAD_REQUEST);
    }

    if (jeton.utiliseLe) {
      throw new AppError(
        'Ce lien a déjà été utilisé. Demandez-en un nouveau.',
        StatusCodes.BAD_REQUEST
      );
    }

    if (jeton.expireLe.getTime() < Date.now()) {
      throw new AppError(
        'Ce lien a expiré. Demandez-en un nouveau.',
        StatusCodes.BAD_REQUEST
      );
    }

    if (jeton.utilisateur.blocked) {
      throw new AppError('Ce compte a été bloqué.', StatusCodes.FORBIDDEN);
    }

    const motDePasseHache = await bcrypt.hash(nouveauMotDePasse, COUT_BCRYPT);

    /**
     * Transaction : les trois opérations forment un tout indivisible.
     * Si le marquage du jeton échouait après le changement de mot de
     * passe, le lien resterait réutilisable — c'est exactement le genre
     * d'état incohérent qu'une transaction empêche.
     */
    await prisma.$transaction([
      prisma.utilisateur.update({
        where: { id: jeton.utilisateurId },
        data: {
          password: motDePasseHache,
          // Invalide toutes les sessions ouvertes (voir en-tête du fichier).
          tokenVersion: { increment: 1 },
        },
      }),
      prisma.jetonReinitialisation.update({
        where: { id: jeton.id },
        data: { utiliseLe: new Date() },
      }),
      // Ceinture et bretelles : neutralise tout autre jeton actif.
      prisma.jetonReinitialisation.updateMany({
        where: { utilisateurId: jeton.utilisateurId, utiliseLe: null },
        data: { utiliseLe: new Date() },
      }),
    ]);

    logger.info(
      { utilisateurId: jeton.utilisateurId },
      'Mot de passe réinitialisé avec succès'
    );

    // Email de courtoisie, non bloquant : c'est lui qui alerte la victime
    // d'un détournement de compte.
    void NotificationService.confirmerChangementMotDePasse(
      jeton.utilisateur.email,
      jeton.utilisateur.nomComplet
    );
  }

  /**
   * Purge des jetons expirés ou consommés depuis plus de 7 jours.
   * À appeler périodiquement : sans cela la table croît indéfiniment.
   */
  static async purgerJetonsObsoletes(): Promise<number> {
    const seuil = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const { count } = await prisma.jetonReinitialisation.deleteMany({
      where: {
        OR: [{ expireLe: { lt: seuil } }, { utiliseLe: { lt: seuil } }],
      },
    });

    if (count > 0) {
      logger.info({ count }, 'Jetons de réinitialisation purgés');
    }

    return count;
  }

  /** Exposée pour les tests et l'affichage côté client. */
  static get dureeValiditeMinutes(): number {
    return DUREE_VALIDITE_MINUTES;
  }
}
