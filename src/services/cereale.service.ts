import cerealeRepository from '../repository/cereale.repository.js';
import type { Cereale } from '@prisma/client';
import type { CerealeCreate, CerealeUpdate } from '../validator/creation.schema.js';
import { CerealeCreateSchema, CerealeUpdateSchema } from '../validator/creation.schema.js';

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
        throw new Error('Une céréale avec ce nom existe déjà');
      }

      const cereale = await cerealeRepository.create(validatedData);
      console.log(`Céréale créée avec succès: ${cereale.nom}`);
      return cereale;
    } catch (error) {
      console.error('Erreur dans le service lors de la création de la céréale:', error);
      throw error;
    }
  }

  async findAll(): Promise<Cereale[]> {
    try {
      const cereales = await cerealeRepository.findAll();
      console.log(`${cereales.length} céréales récupérées`);
      return cereales;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des céréales:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Cereale | null> {
    try {
      const cereale = await cerealeRepository.findById(id);
      if (!cereale) {
        console.log(`Céréale avec l'ID ${id} non trouvée`);
        return null;
      }
      console.log(`Céréale trouvée: ${cereale.nom}`);
      return cereale;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération de la céréale:', error);
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
        throw new Error('Céréale non trouvée');
      }

      // Vérifier si le nouveau nom n'est pas déjà utilisé par une autre céréale
      if (validatedData.nom) {
        const allCereales = await cerealeRepository.findAll();
        const duplicate = allCereales.find(cereale =>
          cereale.nom.toLowerCase() === validatedData.nom!.toLowerCase() && cereale.id !== id
        );

        if (duplicate) {
          throw new Error('Une céréale avec ce nom existe déjà');
        }
      }

      const cereale = await cerealeRepository.update(id, validatedData);
      console.log(`Céréale mise à jour avec succès: ${cereale.nom}`);
      return cereale;
    } catch (error) {
      console.error('Erreur dans le service lors de la mise à jour de la céréale:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<Cereale> {
    try {
      // Vérifier si la céréale existe
      const existingCereale = await cerealeRepository.findById(id);
      if (!existingCereale) {
        throw new Error('Céréale non trouvée');
      }

      const cereale = await cerealeRepository.delete(id);
      console.log(`Céréale supprimée avec succès: ${cereale.nom}`);
      return cereale;
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression de la céréale:', error);
      throw error;
    }
  }
}

export default new CerealeService();