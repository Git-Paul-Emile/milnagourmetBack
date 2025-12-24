import twilio from 'twilio';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export class WhatsAppService {
    static async sendOrderNotification(orderData) {
        try {
            const vendorNumber = process.env.VENDOR_WHATSAPP_NUMBER;
            if (!vendorNumber) {
                console.warn('Numéro WhatsApp du vendeur non configuré');
                return;
            }
            const message = `🔔 Nouvelle commande reçue !\n\nClient: ${orderData.nomClient}\nTéléphone: ${orderData.telephoneClient}\n\nDétails de la commande :\n${this.formatOrderDetails(orderData)}\n\nVeuillez traiter cette commande rapidement.`;
            await client.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: vendorNumber,
                body: message,
            });
            console.log('Notification WhatsApp envoyée au vendeur pour la commande', orderData.numeroCommande);
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de la notification WhatsApp :', error);
            throw new Error('Échec de l\'envoi de la notification WhatsApp');
        }
    }
    static formatOrderDetails(orderData) {
        let details = `Numéro de commande: ${orderData.numeroCommande}\nMontant total: ${orderData.montantTotal} FCFA\nFrais de livraison: ${orderData.fraisLivraison} FCFA\n`;
        if (orderData.notes) {
            details += `Notes: ${orderData.notes}\n`;
        }
        if (orderData.elements && orderData.elements.length > 0) {
            details += `\nProduits:\n`;
            orderData.elements.forEach((element) => {
                details += `- ${element.produit?.nom || 'Produit'} x${element.quantite} (${element.prix} FCFA)\n`;
            });
        }
        if (orderData.creations && orderData.creations.length > 0) {
            details += `\nCréations personnalisées:\n`;
            orderData.creations.forEach((creation) => {
                details += `- ${creation.taille?.nom || 'Création'} x${creation.quantite} (${creation.prix} FCFA)\n`;
            });
        }
        return details;
    }
}
//# sourceMappingURL=whatsapp.service.js.map