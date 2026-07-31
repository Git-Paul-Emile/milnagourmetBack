import deliveryPersonRepository from '../repository/deliveryPerson.repository.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../config/logger.js';

class DeliveryPersonService {
  async getAllDeliveryPersons() {
    try {
      const deliveryPersons = await deliveryPersonRepository.findAll();

      // Convertir vers le format attendu par le frontend
      return deliveryPersons.map((person) => ({
        id: person.id.toString(),
        nomComplet: person.nomComplet,
        phone: person.telephone,
        vehicle: person.vehicule,
        active: person.active,
        createdAt: person.creeLe,
        commandes: person.commandes.map((cmd) => ({
          id: cmd.id.toString(),
          statut: cmd.statut,
          montantTotal: cmd.montantTotal,
          creeLe: cmd.creeLe
        }))
      }));
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération des livreurs:');
      throw error;
    }
  }

  async getDeliveryPersonById(id: string) {
    try {
      const person = await deliveryPersonRepository.findById(id);

      if (!person) {
        throw new AppError('Livreur non trouvé', StatusCodes.NOT_FOUND);
      }

      return {
        id: person.id.toString(),
        nomComplet: person.nomComplet,
        phone: person.telephone,
        vehicle: person.vehicule,
        active: person.active,
        createdAt: person.creeLe
      };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération du livreur:');
      throw error;
    }
  }

  async createDeliveryPerson(data: {
    nomComplet: string;
    phone: string;
    vehicle: string;
  }) {
    try {
      const person = await deliveryPersonRepository.create({
        nomComplet: data.nomComplet,
        telephone: data.phone,
        vehicule: data.vehicle
      });

      return {
        id: person.id.toString(),
        nomComplet: person.nomComplet,
        phone: person.telephone,
        vehicle: person.vehicule,
        active: person.active,
        createdAt: person.creeLe
      };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la création du livreur:');
      throw error;
    }
  }

  async updateDeliveryPerson(id: string, data: {
    nomComplet?: string;
    phone?: string;
    vehicle?: string;
    active?: boolean;
  }) {
    try {
      const person = await deliveryPersonRepository.update(id, {
        nomComplet: data.nomComplet,
        telephone: data.phone,
        vehicule: data.vehicle,
        active: data.active
      });

      return {
        id: person.id.toString(),
        nomComplet: person.nomComplet,
        phone: person.telephone,
        vehicle: person.vehicule,
        active: person.active,
        createdAt: person.creeLe
      };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la mise à jour du livreur:');
      throw error;
    }
  }

  async deleteDeliveryPerson(id: string) {
    try {
      await deliveryPersonRepository.delete(id);
      return { success: true };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la suppression du livreur:');
      throw error;
    }
  }
}

export default new DeliveryPersonService();