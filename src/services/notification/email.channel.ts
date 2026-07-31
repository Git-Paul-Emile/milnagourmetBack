import { Resend } from 'resend';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import type {
  CanalEnvoi,
  ContenuNotification,
  DestinatairesNotification,
} from './channel.types.js';

/**
 * Canal email, adossé à Resend (API HTTP).
 *
 * Pourquoi une API HTTP plutôt que du SMTP ? Le SMTP ouvre une connexion
 * persistante et se comporte mal derrière les hébergeurs qui bloquent le
 * port 587 (cas fréquent). Une requête HTTPS passe partout et remonte une
 * erreur exploitable immédiatement.
 *
 * Le client Resend est instancié paresseusement (lazy) : sans clé API, le
 * module se charge quand même et le canal se déclare simplement « non
 * configuré ». L'application démarre donc en développement sans compte
 * Resend.
 */
class EmailChannel implements CanalEnvoi {
  readonly nom = 'email' as const;

  private client: Resend | null = null;

  estConfigure(): boolean {
    return Boolean(env.RESEND_API_KEY);
  }

  resoudreDestinataire(destinataires: DestinatairesNotification): string | null {
    const email = destinataires.email?.trim();
    return email ? email : null;
  }

  async envoyer(destinataire: string, contenu: ContenuNotification): Promise<void> {
    const client = this.obtenirClient();

    const { error } = await client.emails.send({
      from: env.MAIL_FROM,
      to: [destinataire],
      subject: contenu.sujet,
      // Resend accepte html et text simultanément : le client mail choisit
      // la version qu'il sait afficher.
      html: contenu.html ?? `<pre>${echapperHtml(contenu.texte)}</pre>`,
      text: contenu.texte,
    });

    // Resend ne lève pas d'exception sur erreur métier : il renvoie un
    // objet `error`. Sans ce contrôle, un échec passerait pour un succès.
    if (error) {
      throw new Error(`Échec de l'envoi Resend : ${error.name} — ${error.message}`);
    }

    logger.debug({ canal: this.nom, destinataire }, 'Email envoyé');
  }

  private obtenirClient(): Resend {
    if (!env.RESEND_API_KEY) {
      throw new Error("Canal email non configuré : RESEND_API_KEY est absente.");
    }
    this.client ??= new Resend(env.RESEND_API_KEY);
    return this.client;
  }
}

/**
 * Échappe les caractères ayant un sens en HTML.
 * Indispensable dès qu'on injecte une donnée saisie par un utilisateur
 * (nom du client, notes de commande) dans un email HTML : sans cela, un
 * nom contenant `<script>` serait interprété par le client mail.
 */
export function echapperHtml(valeur: string): string {
  return valeur
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const emailChannel = new EmailChannel();
