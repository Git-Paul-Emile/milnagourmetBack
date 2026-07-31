import fruitRepository from '../repository/fruit.repository.js';
import type { Fruit } from '@prisma/client';
import type { FruitCreate, FruitUpdate } from '../validator/creation.schema.js';
import { FruitCreateSchema, FruitUpdateSchema } from '../validator/creation.schema.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

class FruitService {
  private fruitRepository = fruitRepository;

  async create(data: FruitCreate): Promise<Fruit> {
    try {
      // Validation des données
      const validatedData = FruitCreateSchema.parse(data);

      // Vérifier si un fruit avec le même nom existe déjà
      const existingFruits = await fruitRepository.findAll();
      const duplicate = existingFruits.find(fruit =>
        fruit.nom.toLowerCase() === validatedData.nom.toLowerCase()
      );

      if (duplicate) {
        throw new AppError('Un fruit avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
      }

      const fruit = await fruitRepository.create(validatedData);
      logger.info(`Fruit créé avec succès: ${fruit.nom}`);
      return fruit;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la création du fruit:');
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll(): Promise<Fruit[]> {
    try {
      const fruits = await fruitRepository.findAll();
      logger.info(`${fruits.length} fruits récupérés`);
      return fruits;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération des fruits:');
      throw error;
    }
  }

  async findById(id: number): Promise<Fruit | null> {
    try {
      const fruit = await fruitRepository.findById(id);
      if (!fruit) {
        logger.info(`Fruit avec l'ID ${id} non trouvé`);
        return null;
      }
      logger.info(`Fruit trouvé: ${fruit.nom}`);
      return fruit;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération du fruit:');
      throw error;
    }
  }

  async update(id: number, data: FruitUpdate): Promise<Fruit> {
    try {
      // Validation des données
      const validatedData = FruitUpdateSchema.parse(data);

      // Vérifier si le fruit existe
      const existingFruit = await fruitRepository.findById(id);
      if (!existingFruit) {
        throw new AppError('Fruit non trouvé', StatusCodes.NOT_FOUND);
      }

      // Vérifier si le nouveau nom n'est pas déjà utilisé par un autre fruit
      if (validatedData.nom) {
        const allFruits = await fruitRepository.findAll();
        const duplicate = allFruits.find(fruit =>
          fruit.nom.toLowerCase() === validatedData.nom!.toLowerCase() && fruit.id !== id
        );

        if (duplicate) {
          throw new AppError('Un fruit avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
        }
      }

      const fruit = await fruitRepository.update(id, validatedData);
      logger.info(`Fruit mis à jour avec succès: ${fruit.nom}`);
      return fruit;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la mise à jour du fruit:');
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<Fruit> {
    try {
      // Vérifier si le fruit existe
      const existingFruit = await fruitRepository.findById(id);
      if (!existingFruit) {
        throw new AppError('Fruit non trouvé', StatusCodes.NOT_FOUND);
      }

      const fruit = await fruitRepository.delete(id);
      logger.info(`Fruit supprimé avec succès: ${fruit.nom}`);
      return fruit;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la suppression du fruit:');
      throw error;
    }
  }
}

export default new FruitService();