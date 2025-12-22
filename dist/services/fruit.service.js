import fruitRepository from '../repository/fruit.repository.js';
import { FruitCreateSchema, FruitUpdateSchema } from '../validator/creation.schema.js';
class FruitService {
    fruitRepository = fruitRepository;
    async create(data) {
        try {
            // Validation des données
            const validatedData = FruitCreateSchema.parse(data);
            // Vérifier si un fruit avec le même nom existe déjà
            const existingFruits = await fruitRepository.findAll();
            const duplicate = existingFruits.find(fruit => fruit.nom.toLowerCase() === validatedData.nom.toLowerCase());
            if (duplicate) {
                throw new Error('Un fruit avec ce nom existe déjà');
            }
            const fruit = await fruitRepository.create(validatedData);
            console.log(`Fruit créé avec succès: ${fruit.nom}`);
            return fruit;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la création du fruit:', error);
            throw error;
        }
    }
    async findAll() {
        try {
            const fruits = await fruitRepository.findAll();
            console.log(`${fruits.length} fruits récupérés`);
            return fruits;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération des fruits:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const fruit = await fruitRepository.findById(id);
            if (!fruit) {
                console.log(`Fruit avec l'ID ${id} non trouvé`);
                return null;
            }
            console.log(`Fruit trouvé: ${fruit.nom}`);
            return fruit;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération du fruit:', error);
            throw error;
        }
    }
    async update(id, data) {
        try {
            // Validation des données
            const validatedData = FruitUpdateSchema.parse(data);
            // Vérifier si le fruit existe
            const existingFruit = await fruitRepository.findById(id);
            if (!existingFruit) {
                throw new Error('Fruit non trouvé');
            }
            // Vérifier si le nouveau nom n'est pas déjà utilisé par un autre fruit
            if (validatedData.nom) {
                const allFruits = await fruitRepository.findAll();
                const duplicate = allFruits.find(fruit => fruit.nom.toLowerCase() === validatedData.nom.toLowerCase() && fruit.id !== id);
                if (duplicate) {
                    throw new Error('Un fruit avec ce nom existe déjà');
                }
            }
            const fruit = await fruitRepository.update(id, validatedData);
            console.log(`Fruit mis à jour avec succès: ${fruit.nom}`);
            return fruit;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour du fruit:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            // Vérifier si le fruit existe
            const existingFruit = await fruitRepository.findById(id);
            if (!existingFruit) {
                throw new Error('Fruit non trouvé');
            }
            const fruit = await fruitRepository.delete(id);
            console.log(`Fruit supprimé avec succès: ${fruit.nom}`);
            return fruit;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la suppression du fruit:', error);
            throw error;
        }
    }
}
export default new FruitService();
//# sourceMappingURL=fruit.service.js.map