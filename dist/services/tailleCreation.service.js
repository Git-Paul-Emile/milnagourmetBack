import tailleCreationRepository from '../repository/tailleCreation.repository.js';
import { TailleCreationCreateSchema, TailleCreationUpdateSchema } from '../validator/creation.schema.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
class TailleCreationService {
    tailleCreationRepository = tailleCreationRepository;
    async create(data) {
        try {
            // Validation des données
            const validatedData = TailleCreationCreateSchema.parse(data);
            // Vérifier si une taille avec le même nom existe déjà
            const existingTailles = await tailleCreationRepository.findAll();
            const duplicate = existingTailles.find(taille => taille.nom.toLowerCase() === validatedData.nom.toLowerCase());
            if (duplicate) {
                throw new AppError('Une taille avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
            }
            const taille = await tailleCreationRepository.create(validatedData);
            console.log(`Taille créée avec succès: ${taille.nom}`);
            return taille;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la création de la taille:', error);
            if (error instanceof ZodError) {
                throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
            }
            throw error;
        }
    }
    async findAll() {
        try {
            const tailles = await tailleCreationRepository.findAll();
            console.log(`${tailles.length} tailles récupérées`);
            return tailles;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération des tailles:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const taille = await tailleCreationRepository.findById(id);
            if (!taille) {
                console.log(`Taille avec l'ID ${id} non trouvée`);
                return null;
            }
            console.log(`Taille trouvée: ${taille.nom}`);
            return taille;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération de la taille:', error);
            throw error;
        }
    }
    async update(id, data) {
        try {
            // Validation des données
            const validatedData = TailleCreationUpdateSchema.parse(data);
            // Vérifier si la taille existe
            const existingTaille = await tailleCreationRepository.findById(id);
            if (!existingTaille) {
                throw new AppError('Taille non trouvée', StatusCodes.NOT_FOUND);
            }
            // Vérifier si le nouveau nom n'est pas déjà utilisé par une autre taille
            if (validatedData.nom) {
                const allTailles = await tailleCreationRepository.findAll();
                const duplicate = allTailles.find(taille => taille.nom.toLowerCase() === validatedData.nom.toLowerCase() && taille.id !== id);
                if (duplicate) {
                    throw new AppError('Une taille avec ce nom existe déjà', StatusCodes.BAD_REQUEST);
                }
            }
            const taille = await tailleCreationRepository.update(id, validatedData);
            console.log(`Taille mise à jour avec succès: ${taille.nom}`);
            return taille;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour de la taille:', error);
            if (error instanceof ZodError) {
                throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
            }
            throw error;
        }
    }
    async delete(id) {
        try {
            // Vérifier si la taille existe
            const existingTaille = await tailleCreationRepository.findById(id);
            if (!existingTaille) {
                throw new AppError('Taille non trouvée', StatusCodes.NOT_FOUND);
            }
            const taille = await tailleCreationRepository.delete(id);
            console.log(`Taille supprimée avec succès: ${taille.nom}`);
            return taille;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la suppression de la taille:', error);
            throw error;
        }
    }
}
export default new TailleCreationService();
//# sourceMappingURL=tailleCreation.service.js.map