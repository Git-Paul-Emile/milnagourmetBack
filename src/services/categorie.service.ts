import categorieRepository from '../repository/categorie.repository.js';
import type { CategorieProduitItem } from '@prisma/client';
import type { ProductCategoryCreate, ProductCategoryUpdate } from '../validator/categorie.schema.js';
import { ProductCategoryCreateSchema, ProductCategoryUpdateSchema } from '../validator/categorie.schema.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

// Format de la catégorie tel qu'exposé au frontend
export interface CategorieDTO {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

class CategorieService {
  private categorieRepository = categorieRepository;

  async create(data: ProductCategoryCreate): Promise<CategorieDTO> {
    try {
      // Validation des données
      const validatedData = ProductCategoryCreateSchema.parse(data);

      // Vérifier si une catégorie avec le même nom existe déjà
      const existingCategories = await categorieRepository.findAll();
      const duplicate = existingCategories.find(cat =>
        cat.nom.toLowerCase() === validatedData.nom.toLowerCase()
      );

      if (duplicate) {
        throw new AppError('Une catégorie avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
      }

      const categorie = await categorieRepository.create(validatedData);
      logger.info(`Catégorie créée avec succès: ${categorie.nom}`);

      // Transformer les données pour correspondre à l'interface front-end
      return {
        id: categorie.id,
        name: categorie.nom,
        description: categorie.description,
        active: categorie.active,
        createdAt: categorie.creeLe.toISOString()
      };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la création de la catégorie:');
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll(): Promise<CategorieDTO[]> {
    try {
      const categories = await categorieRepository.findAll();
      logger.info(`${categories.length} catégories récupérées`);

      // Transformer les données pour correspondre à l'interface front-end
      return categories.map(cat => ({
        id: cat.id,
        name: cat.nom,
        description: cat.description,
        active: cat.active,
        createdAt: cat.creeLe.toISOString()
      }));
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération des catégories:');
      throw error;
    }
  }

  async findById(id: number): Promise<CategorieProduitItem | null> {
    try {
      const categorie = await categorieRepository.findById(id);
      if (!categorie) {
        logger.info(`Catégorie avec l'ID ${id} non trouvée`);
        return null;
      }
      logger.info(`Catégorie trouvée: ${categorie.nom}`);
      return categorie;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération de la catégorie:');
      throw error;
    }
  }

  async update(id: number, data: ProductCategoryUpdate): Promise<CategorieDTO> {
    try {
      // Validation des données
      const validatedData = ProductCategoryUpdateSchema.parse(data);

      // Vérifier si la catégorie existe
      const existingCategorie = await categorieRepository.findById(id);
      if (!existingCategorie) {
        throw new AppError('Catégorie non trouvée', StatusCodes.NOT_FOUND);
      }

      // Vérifier si le nouveau nom n'est pas déjà utilisé par une autre catégorie
      if (validatedData.nom) {
        const allCategories = await categorieRepository.findAll();
        const duplicate = allCategories.find(cat =>
          cat.nom.toLowerCase() === validatedData.nom!.toLowerCase() && cat.id !== id
        );

        if (duplicate) {
          throw new AppError('Une catégorie avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
        }
      }

      const categorie = await categorieRepository.update(id, validatedData);
      logger.info(`Catégorie mise à jour avec succès: ${categorie.nom}`);

      // Transformer les données pour correspondre à l'interface front-end
      return {
        id: categorie.id,
        name: categorie.nom,
        description: categorie.description,
        active: categorie.active,
        createdAt: categorie.creeLe.toISOString()
      };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la mise à jour de la catégorie:');
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<CategorieProduitItem> {
    try {
      // Vérifier si la catégorie existe
      const existingCategorie = await categorieRepository.findById(id);
      if (!existingCategorie) {
        throw new AppError('Catégorie non trouvée', StatusCodes.NOT_FOUND);
      }

      const categorie = await categorieRepository.delete(id);
      logger.info(`Catégorie supprimée avec succès: ${categorie.nom}`);
      return categorie;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la suppression de la catégorie:');
      throw error;
    }
  }
}

export default new CategorieService();