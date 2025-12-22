import type { Panier, ElementPanier, Produit } from '@prisma/client';
export interface ElementPanierWithProduit extends ElementPanier {
    produit?: Produit | null;
}
export interface CreationPanierData {
    id: number;
    panierId: number;
    tailleId: number;
    quantite: number;
    prix: number;
    fruits?: string | null;
    sauces?: string | null;
    cereales?: string | null;
    taille?: {
        nom: string;
        prix: number;
        maxFruits: number;
        maxSauces: number;
    } | null;
}
export interface CartWithItems extends Panier {
    elements?: ElementPanierWithProduit[];
    creations?: CreationPanierData[];
}
export interface CreateCartData {
    utilisateurId: number;
}
export interface CreateCartItemData {
    panierId: number;
    produitId: number;
    quantite: number;
    prix: number;
}
export interface UpdateCartItemData {
    quantite?: number;
    prix?: number;
}
declare class CartRepository {
    private prisma;
    create(data: CreateCartData): Promise<Panier>;
    findByUserId(utilisateurId: number): Promise<CartWithItems | null>;
    deleteByUserId(utilisateurId: number): Promise<void>;
    addItem(data: CreateCartItemData): Promise<ElementPanier>;
    updateItem(id: number, data: UpdateCartItemData): Promise<ElementPanier>;
    removeItem(id: number): Promise<void>;
    findCartItem(panierId: number, produitId: number): Promise<ElementPanier | null>;
    clearCart(panierId: number): Promise<void>;
    addCreation(data: {
        panierId: number;
        tailleId: number;
        quantite: number;
        prix: number;
        fruits?: string[];
        sauces?: string[];
        cereales?: string[];
    }): Promise<any>;
    updateCreation(id: number, data: {
        quantite?: number;
        prix?: number;
        fruits?: string[];
        sauces?: string[];
        cereales?: string[];
    }): Promise<any>;
    removeCreation(id: number): Promise<void>;
    findCreationById(id: number): Promise<any>;
    mergeGuestCart(utilisateurId: number, guestItems: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
        customCreation?: any;
    }[]): Promise<void>;
}
declare const _default: CartRepository;
export default _default;
//# sourceMappingURL=cart.repository.d.ts.map