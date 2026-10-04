import type { CanalEnvoi, ContenuNotification, DestinatairesNotification } from './channel.types.js';
/**
 * Canal WhatsApp, adossé à Telnyx (endpoint /v2/messages).
 *
 * Telnyx route un message vers le canal WhatsApp lorsque l'expéditeur
 * (`from`) est un numéro WhatsApp Business activé sur le compte.
 *
 * ⚠️ Fenêtre des 24 h : hors d'une conversation ouverte depuis moins de
 * 24 h, WhatsApp impose un « template » pré-approuvé plutôt qu'un texte
 * libre. Ces templates se configurent dans le portail Telnyx. Tant
 * qu'aucun n'est approuvé, ce canal reste volontairement non configuré et
 * l'orchestrateur bascule sur l'email.
 */
declare class WhatsAppChannel implements CanalEnvoi {
    readonly nom: "whatsapp";
    /**
     * Le canal n'est déclaré prêt que si la clé API ET l'expéditeur sont
     * présents. Un canal à moitié configuré serait pire que pas de canal du
     * tout : il capterait les envois pour échouer systématiquement.
     */
    estConfigure(): boolean;
    resoudreDestinataire(destinataires: DestinatairesNotification): string | null;
    envoyer(destinataire: string, contenu: ContenuNotification): Promise<void>;
}
export declare const whatsappChannel: WhatsAppChannel;
export {};
//# sourceMappingURL=whatsapp.channel.d.ts.map