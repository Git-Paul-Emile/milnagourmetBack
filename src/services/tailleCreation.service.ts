import tailleCreationRepository from '../repository/tailleCreation.repository.js';
import type { TailleCreation } from '@prisma/client';
import type { TailleCreationCreate, TailleCreationUpdate } from '../validator/creation.schema.js';
import { TailleCreationCreateSchema, TailleCreationUpdateSchema } from '../validator/creation.schema.js';

class TailleCreationService {
  private tailleCreationRepository = tailleCreationRepository;

  async create(data: TailleCreationCreate): Promise<TailleCreation> {
    try {
      // Validation des données
      const validatedData = TailleCreationCreateSchema.parse(data);

      // Vérifier si une taille avec le même nom existe déjà
      const existingTailles = await tailleCreationRepository.findAll();
      const duplicate = existingTailles.find(taille =>
        taille.nom.toLowerCase() === validatedData.nom.toLowerCase()
      );

      if (duplicate) {
        throw new Error('Une taille avec ce nom existe déjà');
      }

      const taille = await tailleCreationRepository.create(validatedData);
      console.log(`Taille créée avec succès: ${taille.nom}`);
      return taille;
    } catch (error) {
      console.error('Erreur dans le service lors de la création de la taille:', error);
      throw error;
    }
  }

  async findAll(): Promise<TailleCreation[]> {
    try {
      const tailles = await tailleCreationRepository.findAll();
      console.log(`${tailles.length} tailles récupérées`);
      return tailles;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des tailles:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<TailleCreation | null> {
    try {
      const taille = await tailleCreationRepository.findById(id);
      if (!taille) {
        console.log(`Taille avec l'ID ${id} non trouvée`);
        return null;
      }
      console.log(`Taille trouvée: ${taille.nom}`);
      return taille;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération de la taille:', error);
      throw error;
    }
  }

  async update(id: number, data: TailleCreationUpdate): Promise<TailleCreation> {
    try {
      // Validation des données
      const validatedData = TailleCreationUpdateSchema.parse(data);

      // Vérifier si la taille existe
      const existingTaille = await tailleCreationRepository.findById(id);
      if (!existingTaille) {
        throw new Error('Taille non trouvée');
      }

      // Vérifier si le nouveau nom n'est pas déjà utilisé par une autre taille
      if (validatedData.nom) {
        const allTailles = await tailleCreationRepository.findAll();
        const duplicate = allTailles.find(taille =>
          taille.nom.toLowerCase() === validatedData.nom!.toLowerCase() && taille.id !== id
        );

        if (duplicate) {
          throw new Error('Une taille avec ce nom existe déjà');
        }
      }

      const taille = await tailleCreationRepository.update(id, validatedData);
      console.log(`Taille mise à jour avec succès: ${taille.nom}`);
      return taille;
    } catch (error) {
      console.error('Erreur dans le service lors de la mise à jour de la taille:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<TailleCreation> {
    try {
      // Vérifier si la taille existe
      const existingTaille = await tailleCreationRepository.findById(id);
      if (!existingTaille) {
        throw new Error('Taille non trouvée');
      }

      const taille = await tailleCreationRepository.delete(id);
      console.log(`Taille supprimée avec succès: ${taille.nom}`);
      return taille;
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression de la taille:', error);
      throw error;
    }
  }
}

export default new TailleCreationService();