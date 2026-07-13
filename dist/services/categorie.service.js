import categorieRepository from '../repository/categorie.repository.js';
import { ProductCategoryCreateSchema, ProductCategoryUpdateSchema } from '../validator/categorie.schema.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
class CategorieService {
    categorieRepository = categorieRepository;
    async create(data) {
        try {
            // Validation des données
            const validatedData = ProductCategoryCreateSchema.parse(data);
            // Vérifier si une catégorie avec le même nom existe déjà
            const existingCategories = await categorieRepository.findAll();
            const duplicate = existingCategories.find(cat => cat.nom.toLowerCase() === validatedData.nom.toLowerCase());
            if (duplicate) {
                throw new AppError('Une catégorie avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
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
            };
        }
        catch (error) {
            console.error('Erreur dans le service lors de la création de la catégorie:', error);
            if (error instanceof ZodError) {
                throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
            }
            throw error;
        }
    }
    async findAll() {
        try {
            const categories = await categorieRepository.findAll();
            console.log(`${categories.length} catégories récupérées`);
            // Transformer les données pour correspondre à l'interface front-end
            return categories.map(cat => ({
                id: cat.id,
                name: cat.nom,
                description: cat.description,
                active: cat.active,
                createdAt: cat.creeLe.toISOString()
            }));
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération des catégories:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const categorie = await categorieRepository.findById(id);
            if (!categorie) {
                console.log(`Catégorie avec l'ID ${id} non trouvée`);
                return null;
            }
            console.log(`Catégorie trouvée: ${categorie.nom}`);
            return categorie;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération de la catégorie:', error);
            throw error;
        }
    }
    async update(id, data) {
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
                const duplicate = allCategories.find(cat => cat.nom.toLowerCase() === validatedData.nom.toLowerCase() && cat.id !== id);
                if (duplicate) {
                    throw new AppError('Une catégorie avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
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
            };
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour de la catégorie:', error);
            if (error instanceof ZodError) {
                throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
            }
            throw error;
        }
    }
    async delete(id) {
        try {
            // Vérifier si la catégorie existe
            const existingCategorie = await categorieRepository.findById(id);
            if (!existingCategorie) {
                throw new AppError('Catégorie non trouvée', StatusCodes.NOT_FOUND);
            }
            const categorie = await categorieRepository.delete(id);
            console.log(`Catégorie supprimée avec succès: ${categorie.nom}`);
            return categorie;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la suppression de la catégorie:', error);
            throw error;
        }
    }
}
export default new CategorieService();
//# sourceMappingURL=categorie.service.js.map