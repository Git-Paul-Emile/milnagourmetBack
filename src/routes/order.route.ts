import { Router } from 'express';
import orderController from '../controller/order.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
import { authenticateToken } from '../utils/auth.middleware.js';

const router: Router = Router();

// Créer une nouvelle commande
router.post('/', orderController.create);

// Récupérer les commandes de l'utilisateur connecté
router.get('/my-orders', authenticateToken, orderController.getByUser);

// Récupérer toutes les commandes (ADMIN seulement)
router.get('/', requireAdmin, orderController.getAll);

// Récupérer une commande par ID (ADMIN seulement)
router.get('/:id', requireAdmin, orderController.getById);

// Mettre à jour le statut d'une commande (ADMIN seulement)
router.put('/:id/status', requireAdmin, orderController.updateStatus);

export default router;