import { prisma } from "../config/database.js"
import type { Produit } from "@prisma/client"
import type { ProductCreate, ProductUpdate } from "../validator/product.schema.js"


class ProductRepository {

    async create(data: ProductCreate): Promise<Produit> {
        try {
            const product = await prisma.produit.create({ 
                data,
                include: {
                    categorieProduit: true
                }
            });
            return product;
        } catch (error) {
            console.error('Erreur lors de la création du produit:', error);
            throw new Error('Impossible de créer le produit');
        }
    }

    async findAll(): Promise<Produit[]> {
        try {
            const products = await prisma.produit.findMany({
                include: {
                    categorieProduit: true
                },
                orderBy: { creeLe: 'desc' }
            });
            return products;
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            throw new Error('Impossible de récupérer les produits');
        }
    }

    async findById(id: number): Promise<Produit | null> {
        try {
            const product = await prisma.produit.findUnique({
                where: { id },
                include: {
                    categorieProduit: true
                }
            });
            return product;
        } catch (error) {
            console.error('Erreur lors de la récupération du produit:', error);
            throw new Error('Impossible de récupérer le produit');
        }
    }

    async update(id: number, data: ProductUpdate): Promise<Produit> {
        try {
            const product = await prisma.produit.update({
                where: { id },
                data,
                include: {
                    categorieProduit: true
                }
            });
            return product;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit:', error);
            throw new Error('Impossible de mettre à jour le produit');
        }
    }

    async delete(id: number): Promise<Produit> {
        try {
            const product = await prisma.produit.delete({
                where: { id },
                include: {
                    categorieProduit: true
                }
            });
            return product;
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            throw new Error('Impossible de supprimer le produit');
        }
    }

}

export default new ProductRepository();