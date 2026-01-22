import cartRepository from '../repository/cart.repository.js';
import { prisma } from '../config/database.js';
import { WhatsAppService } from './whatsapp.service.js';
import { LoyaltyService } from './loyalty.service.js';
import orderRepository from '../repository/order.repository.js';
class CartService {
    cartRepository = cartRepository;
    // Récupérer le panier d'un utilisateur
    async getUserCart(utilisateurId) {
        try {
            return await this.cartRepository.findByUserId(utilisateurId);
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération du panier:', error);
            throw error;
        }
    }
    // Ajouter un produit au panier
    async addToCart(utilisateurId, produitId, quantite) {
        try {
            // Récupérer ou créer le panier
            let cart = await this.cartRepository.findByUserId(utilisateurId);
            if (!cart) {
                cart = await this.cartRepository.create({ utilisateurId });
            }
            if (!cart) {
                throw new Error('Panier introuvable après création');
            }
            // Vérifier si le produit existe déjà dans le panier
            const existingItem = await this.cartRepository.findCartItem(cart.id, produitId);
            if (existingItem) {
                // Mettre à jour la quantité
                // Récupérer le prix du produit depuis la base de données
                const { prisma } = await import('../config/database.js');
                const produit = await prisma.produit.findUnique({
                    where: { id: produitId }
                });
                if (!produit) {
                    throw new Error('Produit non trouvé');
                }
                await this.cartRepository.updateItem(existingItem.id, {
                    quantite: existingItem.quantite + quantite,
                    // Mettre à jour le prix au cas où il aurait changé
                    prix: produit.prix
                });
            }
            else {
                // Récupérer le prix du produit depuis la base de données
                const { prisma } = await import('../config/database.js');
                const produit = await prisma.produit.findUnique({
                    where: { id: produitId }
                });
                if (!produit) {
                    throw new Error('Produit non trouvé');
                }
                // Ajouter le nouvel élément
                await this.cartRepository.addItem({
                    panierId: cart.id,
                    produitId,
                    quantite,
                    prix: produit.prix
                });
            }
        }
        catch (error) {
            console.error('Erreur dans le service lors de l\'ajout au panier:', error);
            throw error;
        }
    }
    // Mettre à jour la quantité d'un produit dans le panier
    async updateCartItem(utilisateurId, produitId, quantite) {
        try {
            const cart = await this.cartRepository.findByUserId(utilisateurId);
            if (!cart) {
                throw new Error('Panier non trouvé');
            }
            const item = await this.cartRepository.findCartItem(cart.id, produitId);
            if (!item) {
                throw new Error('Produit non trouvé dans le panier');
            }
            if (quantite <= 0) {
                // Supprimer l'élément si quantité <= 0
                await this.cartRepository.removeItem(item.id);
            }
            else {
                await this.cartRepository.updateItem(item.id, { quantite });
            }
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour du panier:', error);
            throw error;
        }
    }
    // Supprimer un produit du panier
    async removeFromCart(utilisateurId, produitId) {
        try {
            const cart = await this.cartRepository.findByUserId(utilisateurId);
            if (!cart) {
                throw new Error('Panier non trouvé');
            }
            const item = await this.cartRepository.findCartItem(cart.id, produitId);
            if (!item) {
                throw new Error('Produit non trouvé dans le panier');
            }
            await this.cartRepository.removeItem(item.id);
        }
        catch (error) {
            console.error('Erreur dans le service lors de la suppression du panier:', error);
            throw error;
        }
    }
    // Vider le panier
    async clearCart(utilisateurId) {
        try {
            const cart = await this.cartRepository.findByUserId(utilisateurId);
            if (cart) {
                await this.cartRepository.clearCart(cart.id);
            }
        }
        catch (error) {
            console.error('Erreur dans le service lors du vidage du panier:', error);
            throw error;
        }
    }
    // Fusionner le panier guest avec le panier utilisateur
    async mergeGuestCart(utilisateurId, guestItems) {
        try {
            await this.cartRepository.mergeGuestCart(utilisateurId, guestItems);
        }
        catch (error) {
            console.error('Erreur dans le service lors de la fusion du panier guest:', error);
            throw error;
        }
    }
    // Ajouter une création personnalisée au panier
    async addCustomCreation(utilisateurId, creationData) {
        try {
            // Récupérer ou créer le panier
            let cart = await this.cartRepository.findByUserId(utilisateurId);
            if (!cart) {
                cart = await this.cartRepository.create({ utilisateurId });
            }
            if (!cart) {
                throw new Error('Panier introuvable après création');
            }
            // Ajouter la création personnalisée
            await this.cartRepository.addCreation({
                panierId: cart.id,
                ...creationData
            });
        }
        catch (error) {
            console.error('Erreur dans le service lors de l\'ajout d\'une création personnalisée:', error);
            throw error;
        }
    }
    // Mettre à jour une création personnalisée dans le panier
    async updateCustomCreation(utilisateurId, creationId, updateData) {
        try {
            await this.cartRepository.updateCreation(creationId, updateData);
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour d\'une création personnalisée:', error);
            throw error;
        }
    }
    // Supprimer une création personnalisée du panier
    async removeCustomCreation(utilisateurId, creationId) {
        try {
            await this.cartRepository.removeCreation(creationId);
        }
        catch (error) {
            console.error('Erreur dans le service lors de la suppression d\'une création personnalisée:', error);
            throw error;
        }
    }
    // Procédure de checkout avec validation du stock et remise fidélité
    async checkout(utilisateurId, pointsToUse = 0) {
        try {
            const cart = await this.cartRepository.findByUserId(utilisateurId);
            if (!cart || ((!cart.elements || cart.elements.length === 0) && (!cart.creations || cart.creations.length === 0))) {
                throw new Error('Le panier est vide');
            }
            // Récupérer les informations de l'utilisateur
            const user = await prisma.utilisateur.findUnique({
                where: { id: utilisateurId },
                select: { nomComplet: true, telephone: true }
            });
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            // Valider le stock pour chaque article
            let totalAmount = 0;
            // Valider les produits réguliers
            if (cart.elements) {
                for (const element of cart.elements) {
                    const product = await prisma.produit.findUnique({
                        where: { id: element.produitId }
                    });
                    if (!product) {
                        throw new Error(`Produit ${element.produitId} non trouvé`);
                    }
                    if (!product.disponible) {
                        throw new Error(`Le produit ${product.nom} n'est pas disponible`);
                    }
                    totalAmount += element.prix * element.quantite;
                }
            }
            // Calculer le total des créations personnalisées
            if (cart.creations) {
                for (const creation of cart.creations) {
                    totalAmount += creation.prix * creation.quantite;
                }
            }
            // Appliquer la remise fidélité si demandée
            let discountAmount = 0;
            if (pointsToUse > 0) {
                discountAmount = await LoyaltyService.usePoints(utilisateurId, pointsToUse);
                totalAmount -= discountAmount;
            }
            // Créer la commande
            const commande = await prisma.commande.create({
                data: {
                    utilisateurId,
                    nomClient: user.nomComplet,
                    telephoneClient: user.telephone,
                    montantTotal: totalAmount,
                    elements: cart.elements ? {
                        create: cart.elements.map(element => ({
                            produitId: element.produitId,
                            quantite: element.quantite,
                            prix: element.prix
                        }))
                    } : undefined,
                    creationsPersonnalisees: cart.creations ? {
                        create: cart.creations.map(creation => ({
                            tailleId: creation.tailleId,
                            quantite: creation.quantite,
                            prix: creation.prix,
                            fruits: creation.fruits ? {
                                create: JSON.parse(creation.fruits).map((fruitName) => ({
                                    fruit: { connect: { nom: fruitName } }
                                }))
                            } : undefined,
                            sauces: creation.sauces ? {
                                create: JSON.parse(creation.sauces).map((sauceName) => ({
                                    sauce: { connect: { nom: sauceName } }
                                }))
                            } : undefined,
                            cereales: creation.cereales ? {
                                create: JSON.parse(creation.cereales).map((cerealeName) => ({
                                    cereale: { connect: { nom: cerealeName } }
                                }))
                            } : undefined
                        }))
                    } : undefined
                }
            });
            // Mettre à jour l'historique des points avec l'ID de commande
            if (pointsToUse > 0) {
                await LoyaltyService.updatePointsHistoryWithOrderId(utilisateurId, commande.id, pointsToUse);
            }
            // Récupérer la commande complète avec relations pour la notification WhatsApp
            const fullOrder = await orderRepository.findById(commande.id);
            // Envoi asynchrone de la notification WhatsApp au vendeur
            WhatsAppService.sendOrderNotification(fullOrder).catch((error) => console.error('Erreur WhatsApp ignorée :', error));
            // Vider le panier
            await this.cartRepository.clearCart(cart.id);
            return {
                orderId: commande.id,
                totalAmount,
                discountAmount
            };
        }
        catch (error) {
            console.error('Erreur lors du checkout:', error);
            throw error;
        }
    }
}
export default new CartService();
//# sourceMappingURL=cart.service.js.map