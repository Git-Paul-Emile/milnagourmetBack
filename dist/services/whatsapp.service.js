import twilio from 'twilio';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export class WhatsAppService {
    static async sendOrderNotification(order) {
        try {
            const vendorNumber = process.env.VENDOR_WHATSAPP_NUMBER;
            if (!vendorNumber) {
                console.warn('Numéro WhatsApp du vendeur non configuré');
                return;
            }
            const message = `🔔 Nouvelle commande reçue !\n\nClient : ${order.nomClient}\nTéléphone: ${order.telephoneClient}\n\nDétails de la commande :\n${this.formatOrderDetails(order)}\nVeuillez traiter cette commande rapidement.`;
            await client.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: vendorNumber,
                body: message,
            });
            console.log('Notification WhatsApp envoyée au vendeur pour la commande', order.numeroCommande);
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de la notification WhatsApp :', error);
            throw new Error('Échec de l\'envoi de la notification WhatsApp');
        }
    }
    static formatOrderDetails(order) {
        let details = '';
        // Produits
        if (order.elements && order.elements.length > 0) {
            details += `Produits:\n`;
            order.elements.forEach((element) => {
                details += `- ${element.produit?.nom || 'Produit'} x${element.quantite} (${element.prix} FCFA)\n`;
            });
        }
        // Créations personnalisées
        if (order.creationsPersonnalisees && order.creationsPersonnalisees.length > 0) {
            if (details)
                details += '\n';
            details += `Créations personnalisées:\n`;
            order.creationsPersonnalisees.forEach((creation) => {
                details += `- ${creation.taille?.nom || 'Création'} x${creation.quantite} (${creation.prix} FCFA)\n`;
            });
        }
        // Frais de livraison et total
        details += `\nFrais de livraison: ${order.fraisLivraison} FCFA\nMontant total: ${order.montantTotal} FCFA`;
        return details;
    }
}
//# sourceMappingURL=whatsapp.service.js.map