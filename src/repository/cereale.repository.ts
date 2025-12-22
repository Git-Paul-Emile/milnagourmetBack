import { prisma } from "../config/database.js"
import type { Cereale } from "@prisma/client"
import type { CerealeCreate, CerealeUpdate } from "../validator/creation.schema.js"


class CerealeRepository {

    async create(data: CerealeCreate): Promise<Cereale> {
        try {
            const cereale = await prisma.cereale.create({ data });
            return cereale;
        } catch (error) {
            console.error('Erreur lors de la création de la céréale:', error);
            throw new Error('Impossible de créer la céréale');
        }
    }

    async findAll(): Promise<Cereale[]> {
        try {
            const cereales = await prisma.cereale.findMany({
                where: { disponible: true },
                orderBy: { ordreAffichage: 'asc' }
            });
            return cereales;
        } catch (error) {
            console.error('Erreur lors de la récupération des céréales:', error);
            throw new Error('Impossible de récupérer les céréales');
        }
    }

    async findById(id: number): Promise<Cereale | null> {
        try {
            const cereale = await prisma.cereale.findUnique({
                where: { id }
            });
            return cereale;
        } catch (error) {
            console.error('Erreur lors de la récupération de la céréale:', error);
            throw new Error('Impossible de récupérer la céréale');
        }
    }

    async update(id: number, data: CerealeUpdate): Promise<Cereale> {
        try {
            const cereale = await prisma.cereale.update({
                where: { id },
                data
            });
            return cereale;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la céréale:', error);
            throw new Error('Impossible de mettre à jour la céréale');
        }
    }

    async delete(id: number): Promise<Cereale> {
        try {
            const cereale = await prisma.cereale.delete({
                where: { id }
            });
            return cereale;
        } catch (error) {
            console.error('Erreur lors de la suppression de la céréale:', error);
            throw new Error('Impossible de supprimer la céréale');
        }
    }

}

export default new CerealeRepository();