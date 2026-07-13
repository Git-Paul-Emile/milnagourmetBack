import { PrismaClient } from '@prisma/client';
import type { Panier, ElementPanier, Produit, CreationPanier } from '@prisma/client';

const prisma = new PrismaClient();

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
    id: number;
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

class CartRepository {
  private prisma: PrismaClient = prisma;

  // Créer un nouveau panier pour un utilisateur
  async create(data: CreateCartData): Promise<Panier> {
    return await this.prisma.panier.create({
      data
    });
  }

  // Trouver le panier d'un utilisateur
  async findByUserId(utilisateurId: number): Promise<CartWithItems | null> {
    const cart = await this.prisma.panier.findFirst({
      where: { utilisateurId },
      include: {
        elements: {
          include: {
            produit: true
          }
        }
      }
    });

    if (!cart) return null;

    const creations = await this.prisma.creationPanier.findMany({
      where: { panierId: cart.id },
      include: { taille: true }
    });

    return {
      ...cart,
      creations: creations.map(c => ({
        id: c.id,
        panierId: c.panierId,
        tailleId: c.tailleId,
        quantite: c.quantite,
        prix: c.prix,
        fruits: c.fruits,
        sauces: c.sauces,
        cereales: c.cereales,
        taille: c.taille ? {
          id: c.taille.id,
          nom: c.taille.nom,
          prix: c.taille.prix,
          maxFruits: c.taille.maxFruits,
          maxSauces: c.taille.maxSauces
        } : null
      }))
    } as CartWithItems;
  }

  // Supprimer le panier d'un utilisateur
  async deleteByUserId(utilisateurId: number): Promise<void> {
    await this.prisma.panier.deleteMany({
      where: { utilisateurId }
    });
  }

  // Ajouter un élément au panier
  async addItem(data: CreateCartItemData): Promise<ElementPanier> {
    return await this.prisma.elementPanier.create({
      data
    });
  }

  // Mettre à jour un élément du panier
  async updateItem(id: number, data: UpdateCartItemData): Promise<ElementPanier> {
    return await this.prisma.elementPanier.update({
      where: { id },
      data
    });
  }

  // Supprimer un élément du panier
  async removeItem(id: number): Promise<void> {
    await this.prisma.elementPanier.delete({
      where: { id }
    });
  }

  // Trouver un élément du panier par panierId et produitId
  async findCartItem(panierId: number, produitId: number): Promise<ElementPanier | null> {
    return await this.prisma.elementPanier.findFirst({
      where: {
        panierId: panierId,
        produitId: produitId
      }
    });
  }

  // Vider tous les éléments d'un panier
  async clearCart(panierId: number): Promise<void> {
    await this.prisma.elementPanier.deleteMany({
      where: { panierId }
    });

    await this.prisma.creationPanier.deleteMany({
      where: { panierId }
    });
  }

  // Méthodes pour les créations personnalisées dans le panier

  // Ajouter une création personnalisée au panier
  async addCreation(data: {
    panierId: number;
    tailleId: number;
    quantite: number;
    prix: number;
    fruits?: string[];
    sauces?: string[];
    cereales?: string[];
  }): Promise<CreationPanier> {
    return await this.prisma.creationPanier.create({
      data: {
        panierId: data.panierId,
        tailleId: data.tailleId,
        quantite: data.quantite,
        prix: data.prix,
        fruits: data.fruits ? JSON.stringify(data.fruits) : null,
        sauces: data.sauces ? JSON.stringify(data.sauces) : null,
        cereales: data.cereales ? JSON.stringify(data.cereales) : null
      }
    });
  }

  // Mettre à jour une création personnalisée dans le panier
  async updateCreation(id: number, data: {
    quantite?: number;
    prix?: number;
    fruits?: string[];
    sauces?: string[];
    cereales?: string[];
  }): Promise<CreationPanierData> {
    const updateData: Record<string, unknown> = {};
    if (data.quantite !== undefined) updateData.quantite = data.quantite;
    if (data.prix !== undefined) updateData.prix = data.prix;
    if (data.fruits !== undefined) updateData.fruits = data.fruits ? JSON.stringify(data.fruits) : null;
    if (data.sauces !== undefined) updateData.sauces = data.sauces ? JSON.stringify(data.sauces) : null;
    if (data.cereales !== undefined) updateData.cereales = data.cereales ? JSON.stringify(data.cereales) : null;

    const updated = await this.prisma.creationPanier.update({
      where: { id },
      data: updateData,
      include: { taille: true }
    });

    return {
      id: updated.id,
      panierId: updated.panierId,
      tailleId: updated.tailleId,
      quantite: updated.quantite,
      prix: updated.prix,
      fruits: updated.fruits,
      sauces: updated.sauces,
      cereales: updated.cereales,
      taille: updated.taille ? {
        id: updated.taille.id,
        nom: updated.taille.nom,
        prix: updated.taille.prix,
        maxFruits: updated.taille.maxFruits,
        maxSauces: updated.taille.maxSauces
      } : null
    };
  }

  // Supprimer une création personnalisée du panier
  async removeCreation(id: number): Promise<void> {
    await this.prisma.creationPanier.delete({ where: { id } });
  }

  // Fusionner un panier guest avec le panier utilisateur
  async mergeGuestCart(utilisateurId: number, guestItems: { id: string; name: string; price: number; quantity: number; image?: string; customCreation?: { size: { id: number }; selectedFruits?: string[]; selectedSauces?: string[]; selectedCereales?: string[] } }[]): Promise<void> {
    // Récupérer ou créer le panier utilisateur
    let cart = await this.findByUserId(utilisateurId);
    if (!cart) {
      cart = await this.create({ utilisateurId });
    }

    if (!cart) {
      throw new Error('Panier introuvable après création');
    }

    // Traiter chaque élément du panier guest
   for (const guestItem of guestItems) {
     // Vérifier si c'est une création personnalisée
     if (guestItem.customCreation?.size?.id) {
       // Résoudre la taille et son prix officiel depuis la base (jamais celui envoyé par le client)
       const taille = await this.prisma.tailleCreation.findUnique({
         where: { id: guestItem.customCreation.size.id }
       });

       if (!taille || !taille.active) {
         console.warn(`Taille de création invalide dans le panier guest, ignorée: ${guestItem.name}`);
         continue;
       }

       await this.addCreation({
         panierId: cart.id,
         tailleId: taille.id,
         quantite: guestItem.quantity,
         prix: taille.prix,
         fruits: guestItem.customCreation.selectedFruits,
         sauces: guestItem.customCreation.selectedSauces,
         cereales: guestItem.customCreation.selectedCereales
       });
       continue;
     }

     // Chercher le produit par nom (le guestItem.id contient le nom du produit)
     const produit = await this.prisma.produit.findFirst({
       where: {
         nom: guestItem.name,
         disponible: true
       }
     });

     if (!produit) {
       console.warn(`Produit non trouvé ou indisponible dans le panier guest: ${guestItem.name}`);
       continue;
     }

     // Chercher si cet élément existe déjà dans le panier utilisateur
     const existingItem = await this.findCartItem(cart.id, produit.id);

     if (existingItem) {
       // Additionner les quantités
       await this.updateItem(existingItem.id, {
         quantite: existingItem.quantite + guestItem.quantity
       });
     } else {
       // Ajouter le nouvel élément
       await this.addItem({
         panierId: cart.id,
         produitId: produit.id,
         quantite: guestItem.quantity,
         prix: produit.prix // Utiliser le prix actuel du produit
       });
     }
   }
  }
}

export default new CartRepository();