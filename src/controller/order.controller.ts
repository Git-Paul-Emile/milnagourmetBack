import type { Request, Response, NextFunction } from 'express';
import type { Prisma, StatutCommande } from '@prisma/client';
import { ZodError } from 'zod';
import { prisma } from '../config/database.js';
import orderRepository from '../repository/order.repository.js';
import { jsonResponse, AppError, buildPaginationMeta } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import type { CommandeWithRelations } from '../repository/order.repository.js';
import { WhatsAppService } from '../services/whatsapp.service.js';
import { LoyaltyService } from '../services/loyalty.service.js';
import deliveryZoneService from '../services/deliveryZone.service.js';
import { orderQuerySchema } from '../validator/query.schema.js';

interface FrontendOrderItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  product?: { id: string; category?: string } | null;
  customCreation?: {
    size?: { id: number; nom: string };
    selectedFruits?: string[];
    selectedSauces?: string[];
    selectedCereales?: string[];
  } | null;
}

interface FrontendOrderData {
  id: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  } | null;
  items: FrontendOrderItem[];
  total: number;
  deliveryFee?: number;
  deliveryZoneId?: string;
  status: string;
  date: string;
  notes?: string;
  pointsUsed?: number;
  pointsDiscount?: number;
}

// Fonction helper pour adapter une commande au format frontend
async function adaptOrderToFrontend(order: CommandeWithRelations) {
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
        ordreAffichage: creation.taille.ordreAffichage || 0
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
    } catch (error) {
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
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orderData: FrontendOrderData = req.body;
      const utilisateurId = orderData.customer ? parseInt(orderData.customer.id) : undefined;

      // Séparer les produits et les créations personnalisées
      const products = orderData.items.filter(item => item.product && !item.id.startsWith('creation'));
      const creations = orderData.items.filter(item => item.customCreation || item.id.startsWith('creation'));

      if (products.length === 0 && creations.length === 0) {
        throw new AppError('La commande ne contient aucun article', StatusCodes.BAD_REQUEST);
      }

      // Résoudre le prix officiel de chaque produit depuis la base (ne jamais faire confiance au prix envoyé par le client)
      let montantProduits = 0;
      const resolvedElements = await Promise.all(products.map(async (item) => {
        const produitId = parseInt(item.id);
        const produit = await prisma.produit.findUnique({ where: { id: produitId } });
        if (!produit || !produit.disponible) {
          throw new AppError(`Produit indisponible : ${item.name}`, StatusCodes.BAD_REQUEST);
        }
        montantProduits += produit.prix * item.quantity;
        return { produitId, quantite: item.quantity, prix: produit.prix };
      }));

      // Résoudre le prix officiel de chaque création (taille) et les ingrédients sélectionnés
      let montantCreations = 0;
      const resolvedCreations = await Promise.all(creations.map(async (item) => {
        const tailleId = item.customCreation?.size?.id;
        const taille = tailleId ? await prisma.tailleCreation.findUnique({ where: { id: tailleId } }) : null;
        if (!taille || !taille.active) {
          throw new AppError(`Taille de création invalide : ${item.customCreation?.size?.nom || ''}`, StatusCodes.BAD_REQUEST);
        }

        const fruits = item.customCreation?.selectedFruits ?
          (await Promise.all(item.customCreation.selectedFruits.map(async (name: string) => {
            const fruit = await prisma.fruit.findFirst({ where: { nom: name } });
            return fruit ? { fruitId: fruit.id } : null;
          }))).filter((f): f is { fruitId: number } => f !== null) : [];

        const sauces = item.customCreation?.selectedSauces ?
          (await Promise.all(item.customCreation.selectedSauces.map(async (name: string) => {
            const sauce = await prisma.sauce.findFirst({ where: { nom: name } });
            return sauce ? { sauceId: sauce.id } : null;
          }))).filter((s): s is { sauceId: number } => s !== null) : [];

        const cereales = item.customCreation?.selectedCereales ?
          (await Promise.all(item.customCreation.selectedCereales.map(async (name: string) => {
            const cereale = await prisma.cereale.findFirst({ where: { nom: name } });
            return cereale ? { cerealeId: cereale.id } : null;
          }))).filter((c): c is { cerealeId: number } => c !== null) : [];

        montantCreations += taille.prix * item.quantity;
        return { tailleId: taille.id, quantite: item.quantity, prix: taille.prix, fruits, sauces, cereales };
      }));

      // Résoudre les frais de livraison depuis la zone en base (ne jamais faire confiance au montant envoyé par le client)
      let fraisLivraison = 0;
      if (utilisateurId) {
        const utilisateur = await prisma.utilisateur.findUnique({ where: { id: utilisateurId }, select: { zoneLivraisonId: true } });
        if (utilisateur?.zoneLivraisonId) {
          const zone = await deliveryZoneService.getDeliveryZoneById(utilisateur.zoneLivraisonId);
          fraisLivraison = zone.deliveryFee;
        }
      } else {
        const zoneId = orderData.deliveryZoneId ? parseInt(orderData.deliveryZoneId) : NaN;
        if (isNaN(zoneId)) {
          throw new AppError('Zone de livraison requise', StatusCodes.BAD_REQUEST);
        }
        const zone = await deliveryZoneService.getDeliveryZoneById(zoneId).catch(() => null);
        if (!zone || !zone.active) {
          throw new AppError('Zone de livraison invalide', StatusCodes.BAD_REQUEST);
        }
        fraisLivraison = zone.deliveryFee;
      }

      const montantAvantRemise = montantProduits + montantCreations + fraisLivraison;

      // Appliquer la remise fidélité si des points sont utilisés (utilisateur connecté uniquement, jamais pour un invité)
      let remise = 0;
      if (utilisateurId && orderData.pointsUsed && orderData.pointsUsed > 0) {
        remise = await LoyaltyService.usePoints(utilisateurId, orderData.pointsUsed);
      }

      const dbOrderData = {
        numeroCommande: `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        utilisateurId,
        nomClient: orderData.customer?.name || 'Client anonyme',
        telephoneClient: orderData.customer?.phone || 'Non spécifié',
        statut: 'RECU' as const,
        montantTotal: Math.max(0, montantAvantRemise - remise),
        fraisLivraison,
        notes: orderData.notes || '',
        elements: resolvedElements,
        creations: resolvedCreations
      };

      const order = await orderRepository.create(dbOrderData);
      const fullOrder = await orderRepository.findById(order.id);

      // Envoi asynchrone de la notification WhatsApp au vendeur (n'échoue jamais la commande)
      if (fullOrder) {
        WhatsAppService.sendOrderNotification(fullOrder).catch((error: unknown) => console.error('Erreur WhatsApp ignorée :', error));
      }

      // Vider le panier et solder les points de fidélité de l'utilisateur connecté
      if (utilisateurId) {
        const cartService = (await import('../services/cart.service.js')).default;
        await cartService.clearCart(utilisateurId);

        if (remise > 0) {
          await LoyaltyService.updatePointsHistoryWithOrderId(utilisateurId, order.id, orderData.pointsUsed!);
        }

        try {
          // Points gagnés sur le montant avant remise fidélité, pour éviter un effet cumulatif
          await LoyaltyService.addPoints(utilisateurId, order.id, montantAvantRemise);
        } catch (error) {
          console.error('[ORDER CREATION] Erreur lors de l\'ajout des points de fidélité:', error);
        }
      }

      const adaptedOrder = await adaptOrderToFrontend(order);

      res.status(StatusCodes.CREATED).json(
        jsonResponse({
          status: 'success',
          message: 'Commande créée avec succès',
          data: adaptedOrder
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer toutes les commandes (pagination/recherche/filtre/tri optionnels via query params)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = orderQuerySchema.parse(req.query);
      const { page, limit, search, sortBy, sortOrder } = query;
      const status = query.status ? (query.status.toUpperCase() as StatutCommande) : undefined;

      const { items: orders, total } = await orderRepository.findAll({
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder
      });

      // Adapter les données pour le frontend
      const adaptedOrders = await Promise.all(orders.map(order => adaptOrderToFrontend(order)));

      const isPaginated = page !== undefined && limit !== undefined;

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Commandes récupérées avec succès',
          data: adaptedOrders,
          meta: isPaginated ? buildPaginationMeta(page, limit, total) : undefined
        })
      );
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST));
      } else {
        next(error);
      }
    }
  }

  // Récupérer une commande par ID
  async getById(req: Request, res: Response, next: NextFunction) {
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

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Commande récupérée avec succès',
          data: adaptedOrder
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer les commandes de l'utilisateur connecté
  async getByUser(req: Request, res: Response, next: NextFunction) {
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

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Commandes récupérées avec succès',
          data: adaptedOrders
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour le statut d'une commande
  async updateStatus(req: Request, res: Response, next: NextFunction) {
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

      const newStatus = String(status).toUpperCase() as StatutCommande;
      const validStatuses: StatutCommande[] = ['RECU', 'LIVREE', 'ANNULEE'];
      if (!validStatuses.includes(newStatus)) {
        throw new AppError('Statut invalide', StatusCodes.BAD_REQUEST);
      }

      const existingOrder = await orderRepository.findById(id);
      if (!existingOrder) {
        throw new AppError('Commande non trouvée', StatusCodes.NOT_FOUND);
      }

      // Seule une commande RECU peut changer de statut : LIVREE/ANNULEE sont des états terminaux
      if (existingOrder.statut !== 'RECU' && existingOrder.statut !== newStatus) {
        throw new AppError(
          `Impossible de modifier le statut d'une commande déjà ${existingOrder.statut === 'LIVREE' ? 'livrée' : 'annulée'}`,
          StatusCodes.BAD_REQUEST
        );
      }

      const order = await orderRepository.updateStatus(id, newStatus);

      // Notification WhatsApp asynchrone au client (n'échoue jamais la mise à jour)
      if (newStatus === 'LIVREE' || newStatus === 'ANNULEE') {
        WhatsAppService.sendCustomerStatusNotification(order, newStatus).catch((error: unknown) =>
          console.error('Erreur notification client ignorée :', error)
        );
      }

      // Adapter les données pour le frontend
      const adaptedOrder = await adaptOrderToFrontend(order);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Statut de la commande mis à jour avec succès',
          data: adaptedOrder
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Assigner (ou retirer) un livreur à une commande
  async assignDeliveryPerson(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        throw new AppError('ID de commande manquant', StatusCodes.BAD_REQUEST);
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        throw new AppError('ID de commande invalide', StatusCodes.BAD_REQUEST);
      }

      const { livreurId } = req.body;
      let parsedLivreurId: number | null = null;
      if (livreurId !== null && livreurId !== undefined && livreurId !== '') {
        parsedLivreurId = parseInt(livreurId);
        if (isNaN(parsedLivreurId)) {
          throw new AppError('ID de livreur invalide', StatusCodes.BAD_REQUEST);
        }
        // Vérifie que le livreur existe (lève une 404 sinon)
        const deliveryPersonService = (await import('../services/deliveryPerson.service.js')).default;
        await deliveryPersonService.getDeliveryPersonById(parsedLivreurId.toString());
      }

      const order = await orderRepository.assignDeliveryPerson(id, parsedLivreurId);
      const adaptedOrder = await adaptOrderToFrontend(order);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: parsedLivreurId ? 'Livreur assigné avec succès' : 'Livreur retiré avec succès',
          data: adaptedOrder
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer les revenus agrégés par période (ADMIN, pour les graphiques analytics)
  async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const { period } = req.params;
      if (period !== 'day' && period !== 'week' && period !== 'month') {
        throw new AppError('Période invalide (day, week ou month)', StatusCodes.BAD_REQUEST);
      }

      const { startDate, endDate } = req.query;
      const where: Prisma.CommandeWhereInput = { statut: { not: 'ANNULEE' } };
      if (startDate || endDate) {
        where.creeLe = {};
        if (typeof startDate === 'string') where.creeLe.gte = new Date(startDate);
        if (typeof endDate === 'string') where.creeLe.lte = new Date(endDate);
      }

      const orders = await prisma.commande.findMany({
        where,
        select: { creeLe: true, montantTotal: true },
        orderBy: { creeLe: 'asc' }
      });

      const grouped = new Map<string, number>();
      for (const order of orders) {
        const key = getRevenueGroupKey(order.creeLe, period);
        grouped.set(key, (grouped.get(key) || 0) + order.montantTotal);
      }

      const data = Array.from(grouped.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({ date, revenue }));

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Revenus récupérés avec succès',
          data
        })
      );
    } catch (error) {
      next(error);
    }
  }

}

// Regroupe une date en clé jour (YYYY-MM-DD), semaine (lundi de la semaine) ou mois (YYYY-MM)
function getRevenueGroupKey(date: Date, period: 'day' | 'week' | 'month'): string {
  if (period === 'month') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  if (period === 'week') {
    const monday = new Date(date);
    const dayOfWeek = monday.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Reculer jusqu'au lundi
    monday.setDate(monday.getDate() + diff);
    return monday.toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

export default new OrderController();
