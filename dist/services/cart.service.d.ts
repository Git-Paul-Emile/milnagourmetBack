import type { CartWithItems } from '../repository/cart.repository.js';
declare class CartService {
    private cartRepository;
    getUserCart(utilisateurId: number): Promise<CartWithItems | null>;
    addToCart(utilisateurId: number, produitId: number, quantite: number): Promise<void>;
    updateCartItem(utilisateurId: number, produitId: number, quantite: number): Promise<void>;
    removeFromCart(utilisateurId: number, produitId: number): Promise<void>;
    clearCart(utilisateurId: number): Promise<void>;
    mergeGuestCart(utilisateurId: number, guestItems: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
    }[]): Promise<void>;
    addCustomCreation(utilisateurId: number, creationData: {
        tailleId: number;
        quantite: number;
        prix: number;
        fruits?: string[];
        sauces?: string[];
        cereales?: string[];
    }): Promise<void>;
    updateCustomCreation(utilisateurId: number, creationId: number, updateData: {
        quantite?: number;
        prix?: number;
        fruits?: string[];
        sauces?: string[];
        cereales?: string[];
    }): Promise<void>;
    removeCustomCreation(utilisateurId: number, creationId: number): Promise<void>;
    checkout(utilisateurId: number, pointsToUse?: number): Promise<{
        orderId: number;
        totalAmount: number;
        discountAmount?: number;
    }>;
}
declare const _default: CartService;
export default _default;
//# sourceMappingURL=cart.service.d.ts.map