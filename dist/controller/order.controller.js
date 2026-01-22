import { prisma } from '../config/database.js';
import orderRepository from '../repository/order.repository.js';
import userRepository from '../repository/user.repository.js';
import { jsonResponse, AppError } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { WhatsAppService } from '../services/whatsapp.service.js';
import { LoyaltyService } from '../services/loyalty.service.js';
// Fonction helper pour adapter une commande au format frontend
async function adaptOrderToFrontend(order) {
    // Mapper les éléments de commande (produits normaux)
    const regularItems = (order.elements ?? []).map((element) => ({
        id: element.produitId.toString(),
        name: element.produit?.nom || '',
        description: element.produit?.description || '',
        price: element.prix,
        quantity: element.quantite,
        image: element.produit?.image || '',
        product: element.produit ? {
            id: element.produit.id.toString(),
            name: element.produit.nom,
            category: String(element.produit.categorie).toLowerCase(),
            price: element.produit.prix,
            description: element.produit.description || '',
            image: element.produit.image || '',
            available: element.produit.disponible,
            archived: false
        } : undefined
    }));
    // Mapper les créations personnalisées comme des items avec category='creation'
    const creationItems = (order.creationsPersonnalisees ?? []).map((creation) => ({
        id: `creation-${creation.id}`,
        name: `Création personnalisée ${creation.taille.nom}`,
        description: '',
        price: creation.prix,
        quantity: creation.quantite,
        image: '',
        product: {
            id: 'creation',
            name: 'Création personnalisée',
            category: 'creation',
            price: creation.prix,
            description: '',
            image: '',
            available: true,
            archived: false
        },
        customCreation: {
            size: {
                id: creation.taille.id,
                nom: creation.taille.nom,
                prix: creation.taille.prix,
                maxFruits: creation.taille.maxFruits || 0,
                maxSauces: creation.taille.maxSauces || 0,
                cerealesAutorise: creation.taille.cerealesAutorise || false,
                active: creation.taille.active || true,
                ordreAffichage: creation.taille.ordreAffichage || 0,
                creeLe: creation.taille.creeLe?.toISOString() || new Date().toISOString()
            },
            selectedFruits: creation.fruits?.map((f) => f.fruit.nom) || [],
            selectedSauces: creation.sauces?.map((s) => s.sauce.nom) || [],
            selectedCereales: creation.cereales?.map((c) => c.cereale.nom) || [],
            totalPrice: creation.prix
        }
    }));
    // Récupérer la zone de livraison depuis l'utilisateur si elle existe
    let deliveryZone = null;
    if (order.utilisateur?.zoneLivraisonId) {
        try {
            const deliveryZoneService = (await import('../services/deliveryZone.service.js')).default;
            const zone = await deliveryZoneService.getDeliveryZoneById(order.utilisateur.zoneLivraisonId);
            if (zone) {
                deliveryZone = {
                    id: zone.id,
                    name: zone.name,
                    deliveryFee: zone.deliveryFee,
                    estimatedTime: zone.estimatedTime,
                    active: zone.active
                };
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la zone de livraison:', error);
        }
    }
    return {
        id: order.id.toString(),
        orderNumber: order.numeroCommande,
        customer: order.utilisateur ? {
            id: order.utilisateur.id.toString(),
            name: order.utilisateur.nomComplet,
            phone: order.utilisateur.telephone,
            email: 'Non spécifié'
        } : {
            name: order.nomClient,
            phone: order.telephoneClient
        },
        items: [...regularItems, ...creationItems],
        total: order.montantTotal,
        status: String(order.statut).toLowerCase(),
        date: order.creeLe.toISOString(),
        notes: order.notes || '',
        deliveryZone,
        deliveryPerson: order.livreur ? {
            id: order.livreur.id.toString(),
            nomComplet: order.livreur.nomComplet,
            phone: order.livreur.telephone
        } : null
    };
}
class OrderController {
    // Créer une nouvelle commande
    async create(req, res, next) {
        try {
            console.log('[ORDER CREATION] Démarrage de la création de commande');
            const orderData = req.body;
            const utilisateurId = orderData.customer ? parseInt(orderData.customer.id) : undefined;
            console.log('[ORDER CREATION] Données reçues:', { utilisateurId, total: orderData.total, itemsCount: orderData.items.length });
            // Zone de livraison supprimée selon les nouvelles exigences
            // Log détaillé des items reçus
            console.log('[ORDER CREATION] Items reçus:');
            orderData.items.forEach((item, index) => {
                console.log(`[ORDER CREATION] Item ${index + 1}:`, {
                    id: item.id,
                    name: item.name,
                    hasCustomCreation: !!item.customCreation,
                    customCreationKeys: item.customCreation ? Object.keys(item.customCreation) : null,
                    selectedFruits: item.customCreation?.selectedFruits,
                    selectedSauces: item.customCreation?.selectedSauces,
                    selectedCereales: item.customCreation?.selectedCereales
                });
            });
            // Séparer les produits et les créations personnalisées
            const products = orderData.items.filter(item => item.product && !item.id.startsWith('creation'));
            const creations = orderData.items.filter(item => item.customCreation || item.id.startsWith('creation'));
            console.log('[ORDER CREATION] Produits séparés:', { productsCount: products.length, creationsCount: creations.length });
            // Adapter les données du frontend au format de la base de données
            const dbOrderData = {
                numeroCommande: `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                utilisateurId,
                nomClient: orderData.customer?.name || 'Client anonyme',
                telephoneClient: orderData.customer?.phone || 'Non spécifié',
                statut: 'RECU', // Forcer le statut RECU par défaut
                montantTotal: orderData.total, // Le total incluant les frais de livraison et les réductions
                fraisLivraison: orderData.deliveryFee || 0,
                notes: orderData.notes || '',
                elements: products.map(item => ({
                    produitId: parseInt(item.id),
                    quantite: item.quantity,
                    prix: item.price
                })),
                creations: await Promise.all(creations.map(async (item) => {
                    // Pour les créations, récupérer les IDs des ingrédients
                    const tailleId = item.customCreation?.size?.id || 1; // Valeur par défaut
                    // Résoudre les IDs des fruits, sauces, céréales par nom
                    const fruits = item.customCreation?.selectedFruits ?
                        (await Promise.all(item.customCreation.selectedFruits.map(async (name) => {
                            const fruit = await prisma.fruit.findFirst({ where: { nom: name } });
                            return fruit ? { fruitId: fruit.id } : null;
                        }))).filter(Boolean) : [];
                    const sauces = item.customCreation?.selectedSauces ?
                        (await Promise.all(item.customCreation.selectedSauces.map(async (name) => {
                            const sauce = await prisma.sauce.findFirst({ where: { nom: name } });
                            return sauce ? { sauceId: sauce.id } : null;
                        }))).filter(Boolean) : [];
                    const cereales = item.customCreation?.selectedCereales ?
                        (await Promise.all(item.customCreation.selectedCereales.map(async (name) => {
                            const cereale = await prisma.cereale.findFirst({ where: { nom: name } });
                            return cereale ? { cerealeId: cereale.id } : null;
                        }))).filter(Boolean) : [];
                    return {
                        tailleId,
                        quantite: item.quantity,
                        prix: item.price,
                        fruits,
                        sauces,
                        cereales
                    };
                }))
            };
            // Log détaillé des créations personnalisées
            if (creations.length > 0) {
                console.log('[ORDER CREATION] Détails des créations personnalisées:');
                creations.forEach((creation, index) => {
                    console.log(`[ORDER CREATION] Création ${index + 1}:`, {
                        taille: creation.customCreation?.size?.nom || 'Non spécifiée',
                        quantite: creation.quantity,
                        prix: creation.price,
                        fruits: creation.customCreation?.selectedFruits || [],
                        sauces: creation.customCreation?.selectedSauces || [],
                        cereales: creation.customCreation?.selectedCereales || []
                    });
                });
            }
            console.log('[ORDER CREATION] Données préparées pour la DB:', { utilisateurId: dbOrderData.utilisateurId, montantTotal: dbOrderData.montantTotal, elementsCount: dbOrderData.elements.length, creationsCount: dbOrderData.creations.length });
            console.log('[ORDER CREATION] Création de la commande en base de données...');
            const order = await orderRepository.create(dbOrderData);
            console.log('[ORDER CREATION] Commande créée avec succès, ID:', order.id);
            const fullOrder = await orderRepository.findById(order.id);
            // Envoi asynchrone de la notification WhatsApp au vendeur
            WhatsAppService.sendOrderNotification(fullOrder).catch((error) => console.error('Erreur WhatsApp ignorée :', error));
            // Vider le panier de l'utilisateur après la création de la commande
            if (dbOrderData.utilisateurId) {
                console.log('[ORDER CREATION] Vidage du panier pour l\'utilisateur:', dbOrderData.utilisateurId);
                const cartService = (await import('../services/cart.service.js')).default;
                await cartService.clearCart(dbOrderData.utilisateurId);
                console.log('[ORDER CREATION] Panier vidé avec succès');
                // Utiliser les points de fidélité si fournis
                if (orderData.pointsUsed && orderData.pointsUsed > 0) {
                    try {
                        console.log('[ORDER CREATION] Utilisation des points de fidélité:', orderData.pointsUsed);
                        await LoyaltyService.usePoints(dbOrderData.utilisateurId, orderData.pointsUsed, order.id);
                        console.log('[ORDER CREATION] Points de fidélité utilisés avec succès');
                    }
                    catch (error) {
                        console.error('[ORDER CREATION] Erreur lors de l\'utilisation des points de fidélité:', error);
                        // Ne pas échouer la commande pour une erreur de fidélité
                    }
                }
                // Ajouter les points de fidélité gagnés
                try {
                    console.log('[ORDER CREATION] Ajout des points de fidélité pour l\'utilisateur:', dbOrderData.utilisateurId);
                    // Ne pas ajouter de points sur le montant déjà réduit - ajouter sur le montant original
                    const originalAmount = orderData.total + (orderData.deliveryFee || 0);
                    await LoyaltyService.addPoints(dbOrderData.utilisateurId, order.id, originalAmount);
                    console.log('[ORDER CREATION] Points de fidélité ajoutés avec succès');
                }
                catch (error) {
                    console.error('[ORDER CREATION] Erreur lors de l\'ajout des points de fidélité:', error);
                    // Ne pas échouer la commande pour une erreur de fidélité
                }
            }
            // Adapter la réponse pour le frontend
            console.log('[ORDER CREATION] Adaptation de la commande pour le frontend...');
            const adaptedOrder = await adaptOrderToFrontend(order);
            console.log('[ORDER CREATION] Adaptation terminée');
            console.log('[ORDER CREATION] Envoi de la réponse de succès');
            res.status(StatusCodes.CREATED).json(jsonResponse({
                status: 'success',
                message: 'Commande créée avec succès',
                data: adaptedOrder
            }));
            console.log('[ORDER CREATION] Création de commande terminée avec succès');
        }
        catch (error) {
            console.error('[ORDER CREATION] Erreur lors de la création de commande:', error);
            next(error);
        }
    }
    // Récupérer toutes les commandes
    async getAll(req, res, next) {
        try {
            const orders = await orderRepository.findAll();
            // Adapter les données pour le frontend
            const adaptedOrders = await Promise.all(orders.map(order => adaptOrderToFrontend(order)));
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Commandes récupérées avec succès',
                data: adaptedOrders
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer une commande par ID
    async getById(req, res, next) {
        try {
            const idParam = req.params.id;
            if (!idParam) {
                throw new AppError('ID de commande manquant', StatusCodes.BAD_REQUEST);
            }
            const id = parseInt(idParam);
            if (isNaN(id)) {
                throw new AppError('ID de commande invalide', StatusCodes.BAD_REQUEST);
            }
            const order = await orderRepository.findById(id);
            if (!order) {
                throw new AppError('Commande non trouvée', StatusCodes.NOT_FOUND);
            }
            // Adapter les données pour le frontend
            const adaptedOrder = await adaptOrderToFrontend(order);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Commande récupérée avec succès',
                data: adaptedOrder
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les commandes de l'utilisateur connecté
    async getByUser(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
            }
            const id = parseInt(userId);
            if (isNaN(id)) {
                throw new AppError('ID utilisateur invalide', StatusCodes.BAD_REQUEST);
            }
            const orders = await orderRepository.findByUserId(id);
            // Adapter les données pour le frontend
            const adaptedOrders = await Promise.all(orders.map(order => adaptOrderToFrontend(order)));
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Commandes récupérées avec succès',
                data: adaptedOrders
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour le statut d'une commande
    async updateStatus(req, res, next) {
        try {
            const idParam = req.params.id;
            if (!idParam) {
                throw new AppError('ID de commande manquant', StatusCodes.BAD_REQUEST);
            }
            const id = parseInt(idParam);
            if (isNaN(id)) {
                throw new AppError('ID de commande invalide', StatusCodes.BAD_REQUEST);
            }
            const { status } = req.body;
            if (!status) {
                throw new AppError('Statut requis', StatusCodes.BAD_REQUEST);
            }
            const order = await orderRepository.updateStatus(id, status.toUpperCase());
            // Adapter les données pour le frontend
            const adaptedOrder = await adaptOrderToFrontend(order);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Statut de la commande mis à jour avec succès',
                data: adaptedOrder
            }));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new OrderController();
//# sourceMappingURL=order.controller.js.map