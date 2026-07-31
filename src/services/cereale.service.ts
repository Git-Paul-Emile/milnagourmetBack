import cerealeRepository from '../repository/cereale.repository.js';
import type { Cereale } from '@prisma/client';
import type { CerealeCreate, CerealeUpdate } from '../validator/creation.schema.js';
import { CerealeCreateSchema, CerealeUpdateSchema } from '../validator/creation.schema.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

class CerealeService {
  private cerealeRepository = cerealeRepository;

  async create(data: CerealeCreate): Promise<Cereale> {
    try {
      // Validation des données
      const validatedData = CerealeCreateSchema.parse(data);

      // Vérifier si une céréale avec le même nom existe déjà
      const existingCereales = await cerealeRepository.findAll();
      const duplicate = existingCereales.find(cereale =>
        cereale.nom.toLowerCase() === validatedData.nom.toLowerCase()
      );

      if (duplicate) {
        throw new AppError('Une céréale avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
      }

      const cereale = await cerealeRepository.create(validatedData);
      logger.info(`Céréale créée avec succès: ${cereale.nom}`);
      return cereale;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la création de la céréale:');
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll(): Promise<Cereale[]> {
    try {
      const cereales = await cerealeRepository.findAll();
      logger.info(`${cereales.length} céréales récupérées`);
      return cereales;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération des céréales:');
      throw error;
    }
  }

  async findById(id: number): Promise<Cereale | null> {
    try {
      const cereale = await cerealeRepository.findById(id);
      if (!cereale) {
        logger.info(`Céréale avec l'ID ${id} non trouvée`);
        return null;
      }
      logger.info(`Céréale trouvée: ${cereale.nom}`);
      return cereale;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération de la céréale:');
      throw error;
    }
  }

  async update(id: number, data: CerealeUpdate): Promise<Cereale> {
    try {
      // Validation des données
      const validatedData = CerealeUpdateSchema.parse(data);

      // Vérifier si la céréale existe
      const existingCereale = await cerealeRepository.findById(id);
      if (!existingCereale) {
        throw new AppError('Céréale non trouvée', StatusCodes.NOT_FOUND);
      }

      // Vérifier si le nouveau nom n'est pas déjà utilisé par une autre céréale
      if (validatedData.nom) {
        const allCereales = await cerealeRepository.findAll();
        const duplicate = allCereales.find(cereale =>
          cereale.nom.toLowerCase() === validatedData.nom!.toLowerCase() && cereale.id !== id
        );

        if (duplicate) {
          throw new AppError('Une céréale avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
        }
      }

      const cereale = await cerealeRepository.update(id, validatedData);
      logger.info(`Céréale mise à jour avec succès: ${cereale.nom}`);
      return cereale;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la mise à jour de la céréale:');
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<Cereale> {
    try {
      // Vérifier si la céréale existe
      const existingCereale = await cerealeRepository.findById(id);
      if (!existingCereale) {
        throw new AppError('Céréale non trouvée', StatusCodes.NOT_FOUND);
      }

      const cereale = await cerealeRepository.delete(id);
      logger.info(`Céréale supprimée avec succès: ${cereale.nom}`);
      return cereale;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la suppression de la céréale:');
      throw error;
    }
  }
}

export default new CerealeService();
