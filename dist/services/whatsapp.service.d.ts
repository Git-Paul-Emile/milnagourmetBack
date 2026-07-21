import type { CommandeWithRelations } from '../repository/order.repository.js';
export declare class WhatsAppService {
    static sendOrderNotification(order: CommandeWithRelations): Promise<void>;
    static sendCustomerStatusNotification(order: CommandeWithRelations, status: 'LIVREE' | 'ANNULEE'): Promise<void>;
    private static isConfigured;
    /**
     * Envoie un message WhatsApp via l'API Telnyx (endpoint /v2/messages).
     *
     * Telnyx route un message vers le canal WhatsApp lorsque l'expéditeur
     * (`from`) est un numéro WhatsApp Business activé sur le compte. Le
     * `messaging_profile_id` est facultatif mais recommandé côté Telnyx.
     *
     * Important — fenêtre des 24 h : hors d'une conversation ouverte depuis
     * moins de 24 h, WhatsApp impose un « template » pré-approuvé plutôt qu'un
     * texte libre. Ces templates se configurent dans le portail Telnyx ; tant
     * qu'aucun n'est fourni ici, on envoie un texte libre, qui ne passe que
     * dans la fenêtre de 24 h. À compléter une fois les templates approuvés.
     */
    private static sendMessage;
    private static formatOrderDetails;
}
//# sourceMappingURL=whatsapp.service.d.ts.map