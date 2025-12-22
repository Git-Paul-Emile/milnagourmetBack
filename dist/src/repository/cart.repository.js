import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class CartRepository {
    prisma = prisma;
    // Créer un nouveau panier pour un utilisateur
    async create(data) {
        return await this.prisma.panier.create({
            data
        });
    }
    // Trouver le panier d'un utilisateur
    async findByUserId(utilisateurId) {
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
        if (!cart)
            return null;
        // Récupérer les créations personnalisées avec une requête SQL brute
        const creations = await this.prisma.$queryRaw `
      SELECT cc.*, t.nom as taille_nom, t.prix as taille_prix, t.maxFruits, t.maxSauces
      FROM cart_creations cc
      LEFT JOIN creation_sizes t ON cc.tailleId = t.id
      WHERE cc.panierId = ${cart.id}
    `;
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
                taille: c.taille_nom ? {
                    id: c.tailleId,
                    nom: c.taille_nom,
                    prix: c.taille_prix,
                    maxFruits: c.maxFruits,
                    maxSauces: c.maxSauces
                } : null
            }))
        };
    }
    // Supprimer le panier d'un utilisateur
    async deleteByUserId(utilisateurId) {
        await this.prisma.panier.deleteMany({
            where: { utilisateurId }
        });
    }
    // Ajouter un élément au panier
    async addItem(data) {
        return await this.prisma.elementPanier.create({
            data
        });
    }
    // Mettre à jour un élément du panier
    async updateItem(id, data) {
        return await this.prisma.elementPanier.update({
            where: { id },
            data
        });
    }
    // Supprimer un élément du panier
    async removeItem(id) {
        await this.prisma.elementPanier.delete({
            where: { id }
        });
    }
    // Trouver un élément du panier par panierId et produitId
    async findCartItem(panierId, produitId) {
        return await this.prisma.elementPanier.findFirst({
            where: {
                panierId: panierId,
                produitId: produitId
            }
        });
    }
    // Vider tous les éléments d'un panier
    async clearCart(panierId) {
        await this.prisma.elementPanier.deleteMany({
            where: { panierId }
        });
        // Supprimer aussi les créations personnalisées
        await this.prisma.$queryRaw `
      DELETE FROM cart_creations WHERE panierId = ${panierId}
    `;
    }
    // Méthodes pour les créations personnalisées dans le panier
    // Ajouter une création personnalisée au panier
    async addCreation(data) {
        // Utiliser une requête SQL brute car la table peut ne pas être connue par Prisma
        const result = await this.prisma.$queryRaw `
      INSERT INTO cart_creations (panierId, tailleId, quantite, prix, fruits, sauces, cereales)
      VALUES (${data.panierId}, ${data.tailleId}, ${data.quantite}, ${data.prix},
              ${data.fruits ? JSON.stringify(data.fruits) : null},
              ${data.sauces ? JSON.stringify(data.sauces) : null},
              ${data.cereales ? JSON.stringify(data.cereales) : null})
    `;
        // Récupérer l'ID généré
        const [inserted] = await this.prisma.$queryRaw `
      SELECT LAST_INSERT_ID() as id
    `;
        return {
            id: inserted.id,
            panierId: data.panierId,
            tailleId: data.tailleId,
            quantite: data.quantite,
            prix: data.prix,
            fruits: data.fruits ? JSON.stringify(data.fruits) : null,
            sauces: data.sauces ? JSON.stringify(data.sauces) : null,
            cereales: data.cereales ? JSON.stringify(data.cereales) : null
        };
    }
    // Mettre à jour une création personnalisée dans le panier
    async updateCreation(id, data) {
        const updateFields = [];
        const values = [];
        if (data.quantite !== undefined) {
            updateFields.push('quantite = ?');
            values.push(data.quantite);
        }
        if (data.prix !== undefined) {
            updateFields.push('prix = ?');
            values.push(data.prix);
        }
        if (data.fruits !== undefined) {
            updateFields.push('fruits = ?');
            values.push(data.fruits ? JSON.stringify(data.fruits) : null);
        }
        if (data.sauces !== undefined) {
            updateFields.push('sauces = ?');
            values.push(data.sauces ? JSON.stringify(data.sauces) : null);
        }
        if (data.cereales !== undefined) {
            updateFields.push('cereales = ?');
            values.push(data.cereales ? JSON.stringify(data.cereales) : null);
        }
        if (updateFields.length > 0) {
            values.push(id);
            await this.prisma.$queryRawUnsafe(`UPDATE cart_creations SET ${updateFields.join(', ')} WHERE id = ?`, ...values);
        }
        // Récupérer la création mise à jour
        const [updated] = await this.prisma.$queryRaw `
      SELECT cc.*, t.nom as taille_nom, t.prix as taille_prix, t.maxFruits, t.maxSauces
      FROM cart_creations cc
      LEFT JOIN creation_sizes t ON cc.tailleId = t.id
      WHERE cc.id = ${id}
    `;
        return updated ? {
            id: updated.id,
            panierId: updated.panierId,
            tailleId: updated.tailleId,
            quantite: updated.quantite,
            prix: updated.prix,
            fruits: updated.fruits,
            sauces: updated.sauces,
            cereales: updated.cereales,
            taille: updated.taille_nom ? {
                id: updated.tailleId,
                nom: updated.taille_nom,
                prix: updated.taille_prix,
                maxFruits: updated.maxFruits,
                maxSauces: updated.maxSauces
            } : null
        } : null;
    }
    // Supprimer une création personnalisée du panier
    async removeCreation(id) {
        await this.prisma.$queryRaw `
      DELETE FROM cart_creations WHERE id = ${id}
    `;
    }
    // Trouver une création personnalisée par ID
    async findCreationById(id) {
        // Temporairement désactivé car la table n'existe pas encore
        return null;
    }
    // Fusionner un panier guest avec le panier utilisateur
    async mergeGuestCart(utilisateurId, guestItems) {
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
            if (guestItem.id.includes('creation')) {
                // C'est une création personnalisée
                // Pour l'instant, on ne fusionne pas les créations personnalisées du panier guest
                // car elles nécessiteraient une reconstruction complète des données
                console.log(`Création personnalisée dans le panier guest ignorée: ${guestItem.name}`);
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
            }
            else {
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
//# sourceMappingURL=cart.repository.js.map