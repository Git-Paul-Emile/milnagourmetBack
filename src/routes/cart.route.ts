import { Router } from 'express';
import cartController from '../controller/cart.controller.js';
import { authenticateToken } from '../utils/auth.middleware.js';
import validateResource from '../middleware/validateResource.js';
import { addToCartSchema, updateCartItemSchema, addCustomCreationSchema, updateCustomCreationSchema, checkoutSchema } from '../validator/cart.schema.js';

const router: Router = Router();

// Toutes les routes du panier nécessitent une authentification
router.use(authenticateToken);

// GET /api/cart - Récupérer le panier de l'utilisateur
router.get('/', cartController.getCart.bind(cartController));

// POST /api/cart - Ajouter un produit au panier
router.post('/', validateResource(addToCartSchema), cartController.addToCart.bind(cartController));

// PUT /api/cart - Mettre à jour la quantité d'un produit dans le panier
router.put('/', validateResource(updateCartItemSchema), cartController.updateCartItem.bind(cartController));

// DELETE /api/cart/:productId - Supprimer un produit du panier
router.delete('/:productId', cartController.removeFromCart.bind(cartController));

// DELETE /api/cart - Vider le panier
router.delete('/', cartController.clearCart.bind(cartController));

// Routes pour les créations personnalisées
// POST /api/cart/custom - Ajouter une création personnalisée au panier
router.post('/custom', validateResource(addCustomCreationSchema), cartController.addCustomCreation.bind(cartController));

// PUT /api/cart/custom - Mettre à jour une création personnalisée dans le panier
router.put('/custom', validateResource(updateCustomCreationSchema), cartController.updateCustomCreation.bind(cartController));

// DELETE /api/cart/custom/:creationId - Supprimer une création personnalisée du panier
router.delete('/custom/:creationId', cartController.removeCustomCreation.bind(cartController));

// POST /api/cart/checkout - Procedure de checkout
router.post('/checkout', validateResource(checkoutSchema), cartController.checkout.bind(cartController));

export default router;