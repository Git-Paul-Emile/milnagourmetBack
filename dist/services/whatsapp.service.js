import { env } from '../config/env.js';
// Envoi des notifications WhatsApp via Telnyx (remplace l'ancien fournisseur).
// L'API publique de ce service (sendOrderNotification, sendCustomerStatusNotification)
// est inchangée : seuls le transport et les variables d'environnement changent.
const TELNYX_BASE_URL = env.TELNYX_BASE_URL;
export class WhatsAppService {
    static async sendOrderNotification(order) {
        try {
            const vendorNumber = env.VENDOR_WHATSAPP_NUMBER;
            if (!vendorNumber) {
                console.warn('Numéro WhatsApp du vendeur non configuré');
                return;
            }
            if (!WhatsAppService.isConfigured()) {
                console.warn('Telnyx non configuré (clé API ou expéditeur manquant), notification vendeur ignorée');
                return;
            }
            const message = `🔔 Nouvelle commande reçue !\n\nClient : ${order.nomClient}\nTéléphone: ${order.telephoneClient}\n\nDétails de la commande :\n${this.formatOrderDetails(order)}\nVeuillez traiter cette commande rapidement.`;
            await this.sendMessage(vendorNumber, message);
            console.log('Notification WhatsApp envoyée au vendeur pour la commande', order.numeroCommande);
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de la notification WhatsApp :', error);
            throw new Error('Échec de l\'envoi de la notification WhatsApp');
        }
    }
    // Notifie le client par WhatsApp quand une commande est marquée livrée ou annulée
    static async sendCustomerStatusNotification(order, status) {
        try {
            const phone = order.utilisateur?.telephone || order.telephoneClient;
            if (!phone) {
                console.warn('Numéro de téléphone du client introuvable, notification ignorée');
                return;
            }
            if (!WhatsAppService.isConfigured()) {
                console.warn('Telnyx non configuré (clé API ou expéditeur manquant), notification client ignorée');
                return;
            }
            const message = status === 'LIVREE'
                ? `✅ Votre commande ${order.numeroCommande} a été livrée. Merci pour votre confiance !\n\nMontant total : ${order.montantTotal} FCFA\n\n🍯 Milna Gourmet`
                : `❌ Votre commande ${order.numeroCommande} a été annulée.\n\nPour toute question, contactez-nous.\n\n🍯 Milna Gourmet`;
            await this.sendMessage(phone, message);
            console.log(`Notification WhatsApp client envoyée pour la commande ${order.numeroCommande} (${status})`);
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de la notification client WhatsApp :', error);
            throw new Error('Échec de l\'envoi de la notification client WhatsApp');
        }
    }
    // Le service est-il prêt à émettre ? Il faut au minimum la clé API Telnyx
    // et un expéditeur WhatsApp. Sans cela, les notifications sont ignorées en
    // silence (le compte peut n'être rechargé/configuré que plus tard).
    static isConfigured() {
        return Boolean(env.TELNYX_API_KEY && env.TELNYX_WHATSAPP_FROM);
    }
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
    static async sendMessage(to, body) {
        const payload = {
            from: env.TELNYX_WHATSAPP_FROM,
            to,
            text: body,
        };
        // Facultatif : rattache l'envoi à un Messaging Profile Telnyx précis.
        if (env.TELNYX_MESSAGING_PROFILE_ID) {
            payload.messaging_profile_id = env.TELNYX_MESSAGING_PROFILE_ID;
        }
        // Facultatif : force le type de message (ex. "MMS"). Laisser vide pour le
        // routage par défaut du profil de messagerie.
        if (env.TELNYX_MESSAGE_TYPE) {
            payload.type = env.TELNYX_MESSAGE_TYPE;
        }
        const response = await fetch(`${TELNYX_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Échec de l'appel API Telnyx (${response.status}): ${errorBody}`);
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
                // Ajouter les détails des ingrédients sélectionnés
                const fruits = creation.fruits?.map((f) => f.fruit?.nom).filter(Boolean) || [];
                const sauces = creation.sauces?.map((s) => s.sauce?.nom).filter(Boolean) || [];
                const cereales = creation.cereales?.map((c) => c.cereale?.nom).filter(Boolean) || [];
                if (fruits.length > 0) {
                    details += `  • Fruits: ${fruits.join(', ')}\n`;
                }
                if (sauces.length > 0) {
                    details += `  • Sauces: ${sauces.join(', ')}\n`;
                }
                if (cereales.length > 0) {
                    details += `  • Céréales: ${cereales.join(', ')}\n`;
                }
                details += '\n';
            });
        }
        // Frais de livraison et total
        details += `\nFrais de livraison: ${order.fraisLivraison} FCFA\nMontant total: ${order.montantTotal} FCFA`;
        return details;
    }
}
//# sourceMappingURL=whatsapp.service.js.map