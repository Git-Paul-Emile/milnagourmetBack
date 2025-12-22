import deliveryZoneRepository from '../repository/deliveryZone.repository.js';

class DeliveryZoneService {
  async getAllDeliveryZones() {
    try {
      const zones = await deliveryZoneRepository.findAll();

      // Convertir vers le format attendu par le frontend
      return zones.map(zone => ({
        id: zone.id.toString(),
        name: zone.nom,
        deliveryFee: zone.fraisLivraison,
        estimatedTime: zone.tempsEstime,
        active: zone.active
      }));
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des zones de livraison:', error);
      throw error;
    }
  }

  async getAllActive() {
    try {
      const zones = await deliveryZoneRepository.findAllActive();

      // Convertir vers le format attendu par le frontend
      return zones.map(zone => ({
        id: zone.id.toString(),
        name: zone.nom,
        deliveryFee: zone.fraisLivraison,
        estimatedTime: zone.tempsEstime,
        active: zone.active
      }));
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des zones de livraison actives:', error);
      throw error;
    }
  }

  async getAllDeliveryZonesWithOrderCounts() {
    try {
      const zones = await deliveryZoneRepository.findAllWithOrderCounts();

      // Convertir vers le format attendu par le frontend
      return zones.map(zone => ({
        id: zone.id.toString(),
        name: zone.nom,
        deliveryFee: zone.fraisLivraison,
        estimatedTime: zone.tempsEstime,
        active: zone.active,
        orderCount: Number(zone.orderCount),
        totalRevenue: Number(zone.totalRevenue)
      }));
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des zones de livraison avec comptages:', error);
      throw error;
    }
  }

  async getDeliveryZoneById(id: number) {
    try {
      const zone = await deliveryZoneRepository.findById(id);

      if (!zone) {
        throw new Error('Zone de livraison non trouvée');
      }

      return {
        id: zone.id.toString(),
        name: zone.nom,
        deliveryFee: zone.fraisLivraison,
        estimatedTime: zone.tempsEstime,
        active: zone.active
      };
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération de la zone de livraison:', error);
      throw error;
    }
  }

  async createDeliveryZone(data: {
    name: string;
    deliveryFee: number;
    estimatedTime: string;
    active?: boolean;
  }) {
    try {
      const zone = await deliveryZoneRepository.create({
        nom: data.name,
        fraisLivraison: data.deliveryFee,
        tempsEstime: data.estimatedTime,
        active: data.active
      });

      return {
        id: zone.id.toString(),
        name: zone.nom,
        deliveryFee: zone.fraisLivraison,
        estimatedTime: zone.tempsEstime,
        active: zone.active
      };
    } catch (error) {
      console.error('Erreur dans le service lors de la création de la zone de livraison:', error);
      throw error;
    }
  }

  async updateDeliveryZone(id: number, data: {
    name?: string;
    deliveryFee?: number;
    estimatedTime?: string;
    active?: boolean;
  }) {
    try {
      const zone = await deliveryZoneRepository.update(id, {
        nom: data.name,
        fraisLivraison: data.deliveryFee,
        tempsEstime: data.estimatedTime,
        active: data.active
      });

      return {
        id: zone.id.toString(),
        name: zone.nom,
        deliveryFee: zone.fraisLivraison,
        estimatedTime: zone.tempsEstime,
        active: zone.active
      };
    } catch (error) {
      console.error('Erreur dans le service lors de la mise à jour de la zone de livraison:', error);
      throw error;
    }
  }

  async deleteDeliveryZone(id: number) {
    try {
      await deliveryZoneRepository.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression de la zone de livraison:', error);
      throw error;
    }
  }
}

export default new DeliveryZoneService();