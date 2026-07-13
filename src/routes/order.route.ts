import { Router } from 'express';
import orderController from '../controller/order.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
import { authenticateToken } from '../utils/auth.middleware.js';
import validateResource from '../middleware/validateResource.js';
import { createOrderSchema, updateOrderStatusSchema, assignDeliveryPersonSchema } from '../validator/order.schema.js';

const router: Router = Router();

// Créer une nouvelle commande
router.post('/', validateResource(createOrderSchema), orderController.create);

// Récupérer les commandes de l'utilisateur connecté
router.get('/my-orders', authenticateToken, orderController.getByUser);

// Récupérer toutes les commandes (ADMIN seulement)
router.get('/', requireAdmin, orderController.getAll);

// Récupérer les revenus agrégés par période (ADMIN seulement) - doit précéder /:id
router.get('/revenue/:period', requireAdmin, orderController.getRevenue);

// Récupérer une commande par ID (ADMIN seulement)
router.get('/:id', requireAdmin, orderController.getById);

// Mettre à jour le statut d'une commande (ADMIN seulement)
router.put('/:id/status', requireAdmin, validateResource(updateOrderStatusSchema), orderController.updateStatus);

// Assigner un livreur à une commande (ADMIN seulement)
router.put('/:id/delivery-person', requireAdmin, validateResource(assignDeliveryPersonSchema), orderController.assignDeliveryPerson);

export default router;