import userRepository from '../repository/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
class UserService {
    async getAllUsers(options = {}) {
        try {
            const { items: users, total } = await userRepository.findAll(options);
            // Convertir vers le format attendu par le frontend
            const items = users.map((user) => this.transformUser(user));
            return { items, total };
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération des utilisateurs:', error);
            throw error;
        }
    }
    transformUser(user) {
        return {
            id: user.id.toString(),
            name: user.nomComplet,
            phone: user.telephone,
            deliveryZoneId: user.zoneLivraisonId?.toString() || '',
            role: user.role?.toLowerCase() || 'user',
            blocked: Boolean(user.blocked),
            createdAt: user.createdAt,
            orders: user.commandes.map((cmd) => ({
                id: cmd.id.toString(),
                status: cmd.statut,
                total: cmd.montantTotal,
                date: cmd.creeLe.toISOString(),
                items: [],
                notes: '',
                customer: null
            }))
        };
    }
    async updateUser(id, data) {
        try {
            // Vérifier si l'utilisateur existe
            const existingUser = await userRepository.findById(id);
            if (!existingUser) {
                throw new AppError('Utilisateur non trouvé', StatusCodes.NOT_FOUND);
            }
            const payload = {};
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
                role: updated.role?.toLowerCase() || 'user',
                blocked: Boolean(updated.blocked),
                createdAt: updated.createdAt
            };
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour de l’utilisateur:', error);
            throw error;
        }
    }
    async deleteUser(id) {
        try {
            await userRepository.delete(id);
        }
        catch (error) {
            console.error('Erreur dans le service lors de la suppression de l’utilisateur:', error);
            throw error;
        }
    }
}
export default new UserService();
//# sourceMappingURL=user.service.js.map