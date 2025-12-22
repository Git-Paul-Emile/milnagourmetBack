import categorieRepository from '../repository/categorie.repository.js';
import type { CategorieProduitItem } from '@prisma/client';
import type { ProductCategoryCreate, ProductCategoryUpdate } from '../validator/categorie.schema.js';
import { ProductCategoryCreateSchema, ProductCategoryUpdateSchema } from '../validator/categorie.schema.js';

class CategorieService {
  private categorieRepository = categorieRepository;

  async create(data: ProductCategoryCreate): Promise<CategorieProduitItem> {
    try {
      // Validation des données
      const validatedData = ProductCategoryCreateSchema.parse(data);

      // Vérifier si une catégorie avec le même nom existe déjà
      const existingCategories = await categorieRepository.findAll();
      const duplicate = existingCategories.find(cat =>
        cat.nom.toLowerCase() === validatedData.nom.toLowerCase()
      );

      if (duplicate) {
        throw new Error('Une catégorie avec ce nom existe déjà');
      }

      const categorie = await categorieRepository.create(validatedData);
      console.log(`Catégorie créée avec succès: ${categorie.nom}`);

      // Transformer les données pour correspondre à l'interface front-end
      return {
        id: categorie.id,
        name: categorie.nom,
        description: categorie.description,
        active: categorie.active,
        createdAt: categorie.creeLe.toISOString()
      } as any;
    } catch (error) {
      console.error('Erreur dans le service lors de la création de la catégorie:', error);
      throw error;
    }
  }

  async findAll(): Promise<CategorieProduitItem[]> {
    try {
      const categories = await categorieRepository.findAll();
      console.log(`${categories.length} catégories récupérées`);

      // Transformer les données pour correspondre à l'interface front-end
      const transformedCategories = categories.map(cat => ({
        id: cat.id,
        name: cat.nom,
        description: cat.description,
        active: cat.active,
        createdAt: cat.creeLe.toISOString()
      }));

      return transformedCategories as any;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des catégories:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<CategorieProduitItem | null> {
    try {
      const categorie = await categorieRepository.findById(id);
      if (!categorie) {
        console.log(`Catégorie avec l'ID ${id} non trouvée`);
        return null;
      }
      console.log(`Catégorie trouvée: ${categorie.nom}`);
      return categorie;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération de la catégorie:', error);
      throw error;
    }
  }

  async update(id: number, data: ProductCategoryUpdate): Promise<CategorieProduitItem> {
    try {
      // Validation des données
      const validatedData = ProductCategoryUpdateSchema.parse(data);

      // Vérifier si la catégorie existe
      const existingCategorie = await categorieRepository.findById(id);
      if (!existingCategorie) {
        throw new Error('Catégorie non trouvée');
      }

      // Vérifier si le nouveau nom n'est pas déjà utilisé par une autre catégorie
      if (validatedData.nom) {
        const allCategories = await categorieRepository.findAll();
        const duplicate = allCategories.find(cat =>
          cat.nom.toLowerCase() === validatedData.nom!.toLowerCase() && cat.id !== id
        );

        if (duplicate) {
          throw new Error('Une catégorie avec ce nom existe déjà');
        }
      }

      const categorie = await categorieRepository.update(id, validatedData);
      console.log(`Catégorie mise à jour avec succès: ${categorie.nom}`);

      // Transformer les données pour correspondre à l'interface front-end
      return {
        id: categorie.id,
        name: categorie.nom,
        description: categorie.description,
        active: categorie.active,
        createdAt: categorie.creeLe.toISOString()
      } as any;
    } catch (error) {
      console.error('Erreur dans le service lors de la mise à jour de la catégorie:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<CategorieProduitItem> {
    try {
      // Vérifier si la catégorie existe
      const existingCategorie = await categorieRepository.findById(id);
      if (!existingCategorie) {
        throw new Error('Catégorie non trouvée');
      }

      const categorie = await categorieRepository.delete(id);
      console.log(`Catégorie supprimée avec succès: ${categorie.nom}`);
      return categorie;
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression de la catégorie:', error);
      throw error;
    }
  }
}

export default new CategorieService();