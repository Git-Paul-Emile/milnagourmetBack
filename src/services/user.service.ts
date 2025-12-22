import userRepository from '../repository/user.repository.js';

class UserService {
  async getAllUsers() {
    try {
      const users = await userRepository.findAll();

      // Convertir vers le format attendu par le frontend
      return users.map(user => ({
        id: user.id.toString(),
        name: user.nomComplet,
        phone: user.telephone,
        deliveryZoneId: user.zoneLivraisonId?.toString() || '',
        role: (user.role?.toLowerCase() as 'user' | 'admin' | 'delivery') || 'user',
        blocked: Boolean(user.blocked),
        createdAt: user.createdAt,
        orders: (user as any).commandes.map((cmd: any) => ({
          id: cmd.id.toString(),
          status: cmd.statut as 'RECU' | 'EN_PREPARATION' | 'LIVRAISON' | 'LIVREE',
          total: cmd.montantTotal,
          date: cmd.creeLe.toISOString(),
          items: [],
          notes: '',
          customer: null
        }))
      }));
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  async updateUser(id: string, data: Partial<{ blocked: boolean; deliveryZoneId: string }>) {
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
      }

      const payload: any = {};
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
      console.error('Erreur dans le service lors de la mise à jour de l’utilisateur:', error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      await userRepository.delete(id);
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression de l’utilisateur:', error);
      throw error;
    }
  }
}

export default new UserService();