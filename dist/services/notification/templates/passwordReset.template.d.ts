import type { ContenuNotification } from '../channel.types.js';
/**
 * Email de réinitialisation de mot de passe.
 *
 * Ce message ne part JAMAIS par WhatsApp : un lien de réinitialisation
 * transitant par une messagerie tierce est plus exposé (transfert de
 * conversation, appareil partagé), et la boîte mail est le canal attendu
 * par les utilisateurs pour ce type d'opération.
 */
export declare function gabaritReinitialisationMotDePasse(options: {
    nomComplet: string;
    lien: string;
    dureeValiditeMinutes: number;
}): ContenuNotification;
/**
 * Email de confirmation envoyé APRÈS un changement de mot de passe réussi.
 *
 * Point de sécurité souvent négligé : c'est ce message qui permet à la
 * victime d'un détournement de compte de s'en apercevoir immédiatement.
 */
export declare function gabaritMotDePasseModifie(nomComplet: string): ContenuNotification;
//# sourceMappingURL=passwordReset.template.d.ts.map