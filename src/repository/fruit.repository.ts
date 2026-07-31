import { prisma } from "../config/database.js"
import type { Fruit } from "@prisma/client"
import type { FruitCreate, FruitUpdate } from "../validator/creation.schema.js"
import { logger } from '../config/logger.js';


class FruitRepository {

    async create(data: FruitCreate): Promise<Fruit> {
        try {
            const fruit = await prisma.fruit.create({ data });
            return fruit;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la création du fruit:');
            throw new Error('Impossible de créer le fruit');
        }
    }

    async findAll(): Promise<Fruit[]> {
        try {
            const fruits = await prisma.fruit.findMany({
                where: { disponible: true },
                orderBy: { ordreAffichage: 'asc' }
            });
            return fruits;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération des fruits:');
            throw new Error('Impossible de récupérer les fruits');
        }
    }

    async findById(id: number): Promise<Fruit | null> {
        try {
            const fruit = await prisma.fruit.findUnique({
                where: { id }
            });
            return fruit;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération du fruit:');
            throw new Error('Impossible de récupérer le fruit');
        }
    }

    async update(id: number, data: FruitUpdate): Promise<Fruit> {
        try {
            const fruit = await prisma.fruit.update({
                where: { id },
                data
            });
            return fruit;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la mise à jour du fruit:');
            throw new Error('Impossible de mettre à jour le fruit');
        }
    }

    async delete(id: number): Promise<Fruit> {
        try {
            const fruit = await prisma.fruit.delete({
                where: { id }
            });
            return fruit;
        } catch (error) {
            logger.error({ err: error }, 'Erreur lors de la suppression du fruit:');
            throw new Error('Impossible de supprimer le fruit');
        }
    }

}

export default new FruitRepository();