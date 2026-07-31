import { prisma } from "../config/database.js"
import type { CategorieProduitItem } from "@prisma/client"
import type { ProductCategoryCreate, ProductCategoryUpdate } from "../validator/categorie.schema.js"
import { logger } from '../config/logger.js';


class CategorieRepository {

    async create(data: ProductCategoryCreate): Promise<CategorieProduitItem> {
        try {
            const categorie = await prisma.categorieProduitItem.create({ data });
            return categorie;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la création de la catégorie:');
            throw new Error('Impossible de créer la catégorie');
        }
    }

    async findAll(): Promise<CategorieProduitItem[]> {
        try {
            const categories = await prisma.categorieProduitItem.findMany({
                orderBy: { creeLe: 'desc' }
            });
            return categories;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération des catégories:');
            throw new Error('Impossible de récupérer les catégories');
        }
    }

    async findById(id: number): Promise<CategorieProduitItem | null> {
        try {
            const categorie = await prisma.categorieProduitItem.findUnique({
                where: { id }
            });
            return categorie;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération de la catégorie:');
            throw new Error('Impossible de récupérer la catégorie');
        }
    }

    async update(id: number, data: ProductCategoryUpdate): Promise<CategorieProduitItem> {
        try {
            const categorie = await prisma.categorieProduitItem.update({
                where: { id },
                data
            });
            return categorie;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la mise à jour de la catégorie:');
            throw new Error('Impossible de mettre à jour la catégorie');
        }
    }

    async delete(id: number): Promise<CategorieProduitItem> {
        try {
            const categorie = await prisma.categorieProduitItem.delete({
                where: { id }
            });
            return categorie;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la suppression de la catégorie:');
            throw new Error('Impossible de supprimer la catégorie');
        }
    }

}

export default new CategorieRepository();