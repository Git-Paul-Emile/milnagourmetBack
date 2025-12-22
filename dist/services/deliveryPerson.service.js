import deliveryPersonRepository from '../repository/deliveryPerson.repository.js';
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
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération des livreurs:', error);
            throw error;
        }
    }
    async getDeliveryPersonById(id) {
        try {
            const person = await deliveryPersonRepository.findById(id);
            if (!person) {
                throw new Error('Livreur non trouvé');
            }
            return {
                id: person.id.toString(),
                nomComplet: person.nomComplet,
                phone: person.telephone,
                vehicle: person.vehicule,
                active: person.active,
                createdAt: person.creeLe
            };
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération du livreur:', error);
            throw error;
        }
    }
    async createDeliveryPerson(data) {
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
        }
        catch (error) {
            console.error('Erreur dans le service lors de la création du livreur:', error);
            throw error;
        }
    }
    async updateDeliveryPerson(id, data) {
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
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour du livreur:', error);
            throw error;
        }
    }
    async deleteDeliveryPerson(id) {
        try {
            await deliveryPersonRepository.delete(id);
            return { success: true };
        }
        catch (error) {
            console.error('Erreur dans le service lors de la suppression du livreur:', error);
            throw error;
        }
    }
}
export default new DeliveryPersonService();
//# sourceMappingURL=deliveryPerson.service.js.map