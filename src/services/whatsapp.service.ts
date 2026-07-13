import { env } from '../config/env.js';
import type { CommandeWithRelations } from '../repository/order.repository.js';

const D360_BASE_URL = env.D360_BASE_URL;

export class WhatsAppService {
  static async sendOrderNotification(order: CommandeWithRelations): Promise<void> {
    try {
      const vendorNumber = env.VENDOR_WHATSAPP_NUMBER;
      if (!vendorNumber) {
        console.warn('Numéro WhatsApp du vendeur non configuré');
        return;
      }
      if (!env.D360_API_KEY) {
        console.warn('Clé API 360dialog non configurée, notification WhatsApp ignorée');
        return;
      }

      const message = `🔔 Nouvelle commande reçue !\n\nClient : ${order.nomClient}\nTéléphone: ${order.telephoneClient}\n\nDétails de la commande :\n${this.formatOrderDetails(order)}\nVeuillez traiter cette commande rapidement.`;

      await this.sendMessage(vendorNumber, message);

      console.log('Notification WhatsApp envoyée au vendeur pour la commande', order.numeroCommande);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification WhatsApp :', error);
      throw new Error('Échec de l\'envoi de la notification WhatsApp');
    }
  }

  // Notifie le client par WhatsApp quand une commande est marquée livrée ou annulée
  static async sendCustomerStatusNotification(order: CommandeWithRelations, status: 'LIVREE' | 'ANNULEE'): Promise<void> {
    try {
      const phone = order.utilisateur?.telephone || order.telephoneClient;
      if (!phone) {
        console.warn('Numéro de téléphone du client introuvable, notification ignorée');
        return;
      }
      if (!env.D360_API_KEY) {
        console.warn('Clé API 360dialog non configurée, notification client ignorée');
        return;
      }

      const message = status === 'LIVREE'
        ? `✅ Votre commande ${order.numeroCommande} a été livrée. Merci pour votre confiance !\n\nMontant total : ${order.montantTotal} FCFA\n\n🍯 Milna Gourmet`
        : `❌ Votre commande ${order.numeroCommande} a été annulée.\n\nPour toute question, contactez-nous.\n\n🍯 Milna Gourmet`;

      await this.sendMessage(phone, message);

      console.log(`Notification WhatsApp client envoyée pour la commande ${order.numeroCommande} (${status})`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification client WhatsApp :', error);
      throw new Error('Échec de l\'envoi de la notification client WhatsApp');
    }
  }

  // Envoie un message WhatsApp via l'API 360dialog (compatible WhatsApp Cloud API).
  // Note : en dehors d'une fenêtre de conversation de 24h, WhatsApp exige un template
  // pré-approuvé plutôt qu'un message texte libre. Si D360_TEMPLATE_NAME est défini,
  // ce template est utilisé ; sinon un message texte libre est envoyé.
  private static async sendMessage(to: string, body: string): Promise<void> {
    const payload = env.D360_TEMPLATE_NAME
      ? {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: env.D360_TEMPLATE_NAME,
            language: { code: env.D360_TEMPLATE_LANG },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: body }]
              }
            ]
          }
        }
      : {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body }
        };

    const response = await fetch(`${D360_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'D360-API-KEY': env.D360_API_KEY!
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Échec de l'appel API 360dialog (${response.status}): ${errorBody}`);
    }
  }

  private static formatOrderDetails(order: CommandeWithRelations): string {
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
      if (details) details += '\n';
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
