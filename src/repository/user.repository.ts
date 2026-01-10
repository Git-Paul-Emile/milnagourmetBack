import { prisma } from "../config/database.js"
import type { Utilisateur } from "@prisma/client"
import type { RegisterInput } from "../validator/auth.schema.js"

class UserRepository {

    async create(data: RegisterInput): Promise<Utilisateur> {
      try {
        const user = await prisma.utilisateur.create({
          data: {
            telephone: data.telephone,
            nomComplet: data.nomComplet,
            zoneLivraisonId: data.zoneLivraisonId,
            password: data.password, // Sera hashé dans le service
            role: 'USER'
          }
        });
        return user;
      } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw new Error(`Impossible de créer l'utilisateur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    async findAll(): Promise<Utilisateur[]> {
        try {
            const users = await prisma.utilisateur.findMany({
                include: {
                    commandes: {
                        select: {
                            id: true,
                            statut: true,
                            montantTotal: true,
                            creeLe: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return users;
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            throw new Error('Impossible de récupérer les utilisateurs');
        }
    }

    async findByPhone(telephone: string): Promise<Utilisateur | null> {
        try {
            const user = await prisma.utilisateur.findUnique({
                where: { telephone },
                include: {
                    zoneLivraison: true
                }
            });
            return user;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw new Error('Impossible de récupérer l\'utilisateur');
        }
    }

    async findById(id: string): Promise<Utilisateur | null> {
        try {
            const user = await prisma.utilisateur.findUnique({
                where: { id: parseInt(id) },
                include: {
                    zoneLivraison: true
                }
            });
            return user;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw new Error('Impossible de récupérer l\'utilisateur');
        }
    }

    async update(id: string, data: Partial<Utilisateur>): Promise<Utilisateur> {
        try {
            const user = await prisma.utilisateur.update({
                where: { id: parseInt(id) },
                data,
                include: {
                    zoneLivraison: true
                }
            });
            return user;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            throw error;
        }
    }

    async incrementTokenVersion(id: string): Promise<Utilisateur> {
        try {
            const user = await prisma.utilisateur.update({
                where: { id: parseInt(id) },
                data: {
                    tokenVersion: {
                        increment: 1
                    }
                }
            });
            return user;
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation de la version du token:', error);
            throw new Error('Impossible de mettre à jour la version du token');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await prisma.utilisateur.delete({
                where: { id: parseInt(id) }
            });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            throw new Error('Impossible de supprimer l\'utilisateur');
        }
    }

}

export default new UserRepository();