import type { ContenuNotification } from '../channel.types.js';
import { gabaritEmail, paragraphe, bouton } from './layout.js';

/**
 * Email de réinitialisation de mot de passe.
 *
 * Ce message ne part JAMAIS par WhatsApp : un lien de réinitialisation
 * transitant par une messagerie tierce est plus exposé (transfert de
 * conversation, appareil partagé), et la boîte mail est le canal attendu
 * par les utilisateurs pour ce type d'opération.
 */
export function gabaritReinitialisationMotDePasse(options: {
  nomComplet: string;
  lien: string;
  dureeValiditeMinutes: number;
}): ContenuNotification {
  const { nomComplet, lien, dureeValiditeMinutes } = options;

  const texte =
    `Bonjour ${nomComplet},\n\n` +
    `Vous avez demandé la réinitialisation de votre mot de passe Milna Gourmet.\n\n` +
    `Ouvrez ce lien pour choisir un nouveau mot de passe :\n${lien}\n\n` +
    `Ce lien expire dans ${dureeValiditeMinutes} minutes et ne peut servir qu'une seule fois.\n\n` +
    `Si vous n'êtes pas à l'origine de cette demande, ignorez cet email : ` +
    `votre mot de passe actuel reste valable.\n\n🍯 Milna Gourmet`;

  const html = gabaritEmail({
    titre: 'Réinitialisation de votre mot de passe',
    corpsHtml:
      paragraphe(`Bonjour ${nomComplet},`) +
      paragraphe('Vous avez demandé la réinitialisation de votre mot de passe Milna Gourmet.') +
      bouton('Choisir un nouveau mot de passe', lien) +
      paragraphe(
        `Ce lien expire dans ${dureeValiditeMinutes} minutes et ne peut servir qu'une seule fois.`
      ) +
      paragraphe(
        "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email : votre mot de passe actuel reste valable."
      ),
    piedDePage:
      "Vous recevez cet email car une réinitialisation a été demandée pour ce compte. Si le bouton ne fonctionne pas, copiez le lien dans votre navigateur.",
  });

  return {
    sujet: 'Réinitialisation de votre mot de passe Milna Gourmet',
    texte,
    html,
  };
}

/**
 * Email de confirmation envoyé APRÈS un changement de mot de passe réussi.
 *
 * Point de sécurité souvent négligé : c'est ce message qui permet à la
 * victime d'un détournement de compte de s'en apercevoir immédiatement.
 */
export function gabaritMotDePasseModifie(nomComplet: string): ContenuNotification {
  const texte =
    `Bonjour ${nomComplet},\n\n` +
    `Votre mot de passe Milna Gourmet vient d'être modifié.\n` +
    `Toutes vos sessions ouvertes ont été déconnectées.\n\n` +
    `Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement.\n\n🍯 Milna Gourmet`;

  return {
    sujet: 'Votre mot de passe Milna Gourmet a été modifié',
    texte,
    html: gabaritEmail({
      titre: 'Votre mot de passe a été modifié',
      corpsHtml:
        paragraphe(`Bonjour ${nomComplet},`) +
        paragraphe("Votre mot de passe vient d'être modifié et toutes vos sessions ouvertes ont été déconnectées.") +
        paragraphe("Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement."),
    }),
  };
}
