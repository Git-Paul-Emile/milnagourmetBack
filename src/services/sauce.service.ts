import sauceRepository from '../repository/sauce.repository.js';
import type { Sauce } from '@prisma/client';
import type { SauceCreate, SauceUpdate } from '../validator/creation.schema.js';
import { SauceCreateSchema, SauceUpdateSchema } from '../validator/creation.schema.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

class SauceService {
  private sauceRepository = sauceRepository;

  async create(data: SauceCreate): Promise<Sauce> {
    try {
      // Validation des données
      const validatedData = SauceCreateSchema.parse(data);

      // Vérifier si une sauce avec le même nom existe déjà
      const existingSauces = await sauceRepository.findAll();
      const duplicate = existingSauces.find(sauce =>
        sauce.nom.toLowerCase() === validatedData.nom.toLowerCase()
      );

      if (duplicate) {
        throw new AppError('Une sauce avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
      }

      const sauce = await sauceRepository.create(validatedData);
      console.log(`Sauce créée avec succès: ${sauce.nom}`);
      return sauce;
    } catch (error) {
      console.error('Erreur dans le service lors de la création de la sauce:', error);
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll(): Promise<Sauce[]> {
    try {
      const sauces = await sauceRepository.findAll();
      console.log(`${sauces.length} sauces récupérées`);
      return sauces;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des sauces:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Sauce | null> {
    try {
      const sauce = await sauceRepository.findById(id);
      if (!sauce) {
        console.log(`Sauce avec l'ID ${id} non trouvée`);
        return null;
      }
      console.log(`Sauce trouvée: ${sauce.nom}`);
      return sauce;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération de la sauce:', error);
      throw error;
    }
  }

  async update(id: number, data: SauceUpdate): Promise<Sauce> {
    try {
      // Validation des données
      const validatedData = SauceUpdateSchema.parse(data);

      // Vérifier si la sauce existe
      const existingSauce = await sauceRepository.findById(id);
      if (!existingSauce) {
        throw new AppError('Sauce non trouvée', StatusCodes.NOT_FOUND);
      }

      // Vérifier si le nouveau nom n'est pas déjà utilisé par une autre sauce
      if (validatedData.nom) {
        const allSauces = await sauceRepository.findAll();
        const duplicate = allSauces.find(sauce =>
          sauce.nom.toLowerCase() === validatedData.nom!.toLowerCase() && sauce.id !== id
        );

        if (duplicate) {
          throw new AppError('Une sauce avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
        }
      }

      const sauce = await sauceRepository.update(id, validatedData);
      console.log(`Sauce mise à jour avec succès: ${sauce.nom}`);
      return sauce;
    } catch (error) {
      console.error('Erreur dans le service lors de la mise à jour de la sauce:', error);
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<Sauce> {
    try {
      // Vérifier si la sauce existe
      const existingSauce = await sauceRepository.findById(id);
      if (!existingSauce) {
        throw new AppError('Sauce non trouvée', StatusCodes.NOT_FOUND);
      }

      const sauce = await sauceRepository.delete(id);
      console.log(`Sauce supprimée avec succès: ${sauce.nom}`);
      return sauce;
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression de la sauce:', error);
      throw error;
    }
  }
}

export default new SauceService();
