import cartService from '../services/cart.service.js';
import { jsonResponse, AppError } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
//TODO: refaire le service cartservice avec les bonnes pratiques 
class CartController {
    cartService = cartService;
    // Récupérer le panier de l'utilisateur connecté
    async getCart(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const cart = await this.cartService.getUserCart(parseInt(userId));
            // Adapter les données pour le frontend
            const adaptedCart = cart ? {
                id: cart.id.toString(),
                userId: cart.utilisateurId.toString(),
                items: [
                    // Produits réguliers
                    ...(cart.elements ?? []).map(element => ({
                        id: element.produitId.toString(),
                        name: element.produit?.nom || '',
                        description: element.produit?.description || '',
                        price: element.prix,
                        quantity: element.quantite,
                        image: element.produit?.image || ''
                    })),
                    // Créations personnalisées
                    ...(cart.creations ?? []).map(creation => ({
                        id: `creation-${creation.id}`,
                        name: `Gourmet Création ${creation.taille?.nom || 'Personnalisée'}`,
                        description: [
                            creation.fruits ? `Fruits: ${JSON.parse(creation.fruits).join(', ')}` : '',
                            creation.sauces ? `Sauces: ${JSON.parse(creation.sauces).join(', ')}` : '',
                            creation.cereales ? `Céréales: ${JSON.parse(creation.cereales).join(', ')}` : ''
                        ].filter(Boolean).join(' • ') || 'Création personnalisée',
                        price: creation.prix,
                        quantity: creation.quantite,
                        image: '/src/assets/yogurt-creation.jpg',
                        customCreation: {
                            size: creation.taille,
                            selectedFruits: creation.fruits ? JSON.parse(creation.fruits) : [],
                            selectedSauces: creation.sauces ? JSON.parse(creation.sauces) : [],
                            selectedCereales: creation.cereales ? JSON.parse(creation.cereales) : [],
                            totalPrice: creation.prix * creation.quantite
                        }
                    }))
                ],
                createdAt: cart.creeLe.toISOString(),
                updatedAt: cart.modifieLe.toISOString()
            } : null;
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Panier récupéré avec succès',
                data: adaptedCart
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Ajouter un produit au panier
    async addToCart(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const { productId, quantity } = req.body;
            if (!productId || !quantity || quantity <= 0) {
                throw new AppError('ID du produit et quantité valide requis', StatusCodes.BAD_REQUEST);
            }
            await this.cartService.addToCart(parseInt(userId), parseInt(productId), quantity);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Produit ajouté au panier avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour la quantité d'un produit dans le panier
    async updateCartItem(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const { productId, quantity } = req.body;
            if (!productId || quantity === undefined || quantity < 0) {
                throw new AppError('ID du produit et quantité valide requis', StatusCodes.BAD_REQUEST);
            }
            await this.cartService.updateCartItem(parseInt(userId), parseInt(productId), quantity);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Quantité mise à jour avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Supprimer un produit du panier
    async removeFromCart(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const { productId } = req.params;
            if (!productId) {
                throw new AppError('ID du produit requis', StatusCodes.BAD_REQUEST);
            }
            await this.cartService.removeFromCart(parseInt(userId), parseInt(productId));
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Produit supprimé du panier avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Vider le panier
    async clearCart(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            await this.cartService.clearCart(parseInt(userId));
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Panier vidé avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Ajouter une création personnalisée au panier
    async addCustomCreation(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const { tailleId, quantity, price, fruits, sauces, cereales } = req.body;
            if (!tailleId || !quantity || !price || quantity <= 0) {
                throw new AppError('Données de création invalides', StatusCodes.BAD_REQUEST);
            }
            await this.cartService.addCustomCreation(parseInt(userId), {
                tailleId: parseInt(tailleId),
                quantite: quantity,
                prix: price,
                fruits: fruits || [],
                sauces: sauces || [],
                cereales: cereales || []
            });
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Création personnalisée ajoutée au panier avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour une création personnalisée dans le panier
    async updateCustomCreation(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const { creationId, quantity, price, fruits, sauces, cereales } = req.body;
            if (!creationId) {
                throw new AppError('ID de création requis', StatusCodes.BAD_REQUEST);
            }
            await this.cartService.updateCustomCreation(parseInt(userId), parseInt(creationId), {
                quantite: quantity,
                prix: price,
                fruits,
                sauces,
                cereales
            });
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Création personnalisée mise à jour avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Supprimer une création personnalisée du panier
    async removeCustomCreation(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const { creationId } = req.params;
            if (!creationId) {
                throw new AppError('ID de création requis', StatusCodes.BAD_REQUEST);
            }
            await this.cartService.removeCustomCreation(parseInt(userId), parseInt(creationId));
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Création personnalisée supprimée du panier avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Procédure de checkout
    async checkout(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const result = await this.cartService.checkout(parseInt(userId));
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Commande créée avec succès',
                data: {
                    orderId: result.orderId,
                    totalAmount: result.totalAmount
                }
            }));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new CartController();
//# sourceMappingURL=cart.controller.js.map