import type { CommandeWithRelations } from '../repository/order.repository.js';
export declare class WhatsAppService {
    static sendOrderNotification(order: CommandeWithRelations): Promise<void>;
    static sendCustomerStatusNotification(order: CommandeWithRelations, status: 'LIVREE' | 'ANNULEE'): Promise<void>;
    private static sendMessage;
    private static formatOrderDetails;
}
//# sourceMappingURL=whatsapp.service.d.ts.map