import userRepository from '../repository/user.repository.js';
import type { UserListOptions } from '../repository/user.repository.js';
import type { Utilisateur } from '@prisma/client';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../config/logger.js';

export interface UserDTO {
  id: string;
  name: string;
  phone: string;
  deliveryZoneId: string;
  role: 'user' | 'admin' | 'delivery';
  blocked: boolean;
  createdAt: Date;
  orders: {
    id: string;
    status: 'RECU' | 'LIVREE' | 'ANNULEE';
    total: number;
    date: string;
    items: never[];
    notes: string;
    customer: null;
  }[];
}

class UserService {
  async getAllUsers(options: UserListOptions = {}): Promise<{ items: UserDTO[]; total: number }> {
    try {
      const { items: users, total } = await userRepository.findAll(options);

      // Convertir vers le format attendu par le frontend
      const items = users.map((user) => this.transformUser(user));
      return { items, total };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération des utilisateurs:');
      throw error;
    }
  }

  private transformUser(user: Utilisateur & { commandes: { id: number; statut: string; montantTotal: number; creeLe: Date }[] }): UserDTO {
    return {
      id: user.id.toString(),
      name: user.nomComplet,
      phone: user.telephone,
      deliveryZoneId: user.zoneLivraisonId?.toString() || '',
      role: (user.role?.toLowerCase() as 'user' | 'admin' | 'delivery') || 'user',
      blocked: Boolean(user.blocked),
      createdAt: user.createdAt,
      orders: user.commandes.map((cmd) => ({
        id: cmd.id.toString(),
        status: cmd.statut as 'RECU' | 'LIVREE' | 'ANNULEE',
        total: cmd.montantTotal,
        date: cmd.creeLe.toISOString(),
        items: [],
        notes: '',
        customer: null
      }))
    };
  }

  async updateUser(id: string, data: Partial<{ blocked: boolean; deliveryZoneId: string }>) {
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        throw new AppError('Utilisateur non trouvé', StatusCodes.NOT_FOUND);
      }

      const payload: Partial<Utilisateur> = {};
      if (data.blocked !== undefined) {
        payload.blocked = data.blocked;
      }
      if (data.deliveryZoneId !== undefined) {
        payload.zoneLivraisonId = data.deliveryZoneId ? parseInt(data.deliveryZoneId, 10) : null;
      }
      const updated = await userRepository.update(id, payload);
      return {
        id: updated.id.toString(),
        name: updated.nomComplet,
        phone: updated.telephone,
        deliveryZoneId: updated.zoneLivraisonId?.toString() || '',
        role: (updated.role?.toLowerCase() as 'user' | 'admin' | 'delivery') || 'user',
        blocked: Boolean(updated.blocked),
        createdAt: updated.createdAt
      };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la mise à jour de l’utilisateur:');
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      await userRepository.delete(id);
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la suppression de l’utilisateur:');
      throw error;
    }
  }
}

export default new UserService();