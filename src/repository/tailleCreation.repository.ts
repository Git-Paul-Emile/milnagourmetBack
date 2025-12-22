import { prisma } from "../config/database.js"
import type { TailleCreation } from "@prisma/client"
import type { TailleCreationCreate, TailleCreationUpdate } from "../validator/creation.schema.js"


class TailleCreationRepository {

    async create(data: TailleCreationCreate): Promise<TailleCreation> {
        try {
            const taille = await prisma.tailleCreation.create({ data });
            return taille;
        } catch (error) {
            console.error('Erreur lors de la création de la taille:', error);
            throw new Error('Impossible de créer la taille');
        }
    }

    async findAll(): Promise<TailleCreation[]> {
        try {
            const tailles = await prisma.tailleCreation.findMany({
                where: { active: true },
                orderBy: { ordreAffichage: 'asc' }
            });
            return tailles;
        } catch (error) {
            console.error('Erreur lors de la récupération des tailles:', error);
            throw new Error('Impossible de récupérer les tailles');
        }
    }

    async findById(id: number): Promise<TailleCreation | null> {
        try {
            const taille = await prisma.tailleCreation.findUnique({
                where: { id }
            });
            return taille;
        } catch (error) {
            console.error('Erreur lors de la récupération de la taille:', error);
            throw new Error('Impossible de récupérer la taille');
        }
    }

    async update(id: number, data: TailleCreationUpdate): Promise<TailleCreation> {
        try {
            const taille = await prisma.tailleCreation.update({
                where: { id },
                data
            });
            return taille;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la taille:', error);
            throw new Error('Impossible de mettre à jour la taille');
        }
    }

    async delete(id: number): Promise<TailleCreation> {
        try {
            const taille = await prisma.tailleCreation.delete({
                where: { id }
            });
            return taille;
        } catch (error) {
            console.error('Erreur lors de la suppression de la taille:', error);
            throw new Error('Impossible de supprimer la taille');
        }
    }

}

export default new TailleCreationRepository();