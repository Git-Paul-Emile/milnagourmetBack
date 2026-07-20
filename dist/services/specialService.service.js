import specialServiceRepository from '../repository/specialService.repository.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
// Format renvoyé au frontend
function toFrontend(service) {
    return {
        id: service.id,
        code: service.code,
        name: service.nom,
        description: service.description,
        image: service.image,
        active: service.actif,
        minElements: service.minElements,
        // Produit caché lié : nécessaire côté front pour créer la ligne de commande (prix 0 = sur devis)
        linkedProduct: service.produit
            ? {
                id: service.produit.id,
                name: service.produit.nom,
                price: service.produit.prix,
                category: service.produit.categorie.toLowerCase(),
                available: service.produit.disponible,
            }
            : null,
        components: service.composants.map((c) => ({
            id: c.id,
            name: c.nom,
            available: c.disponible,
        })),
    };
}
class SpecialServiceService {
    async getAll() {
        const services = await specialServiceRepository.findAll();
        return services.map(toFrontend);
    }
    async getActive() {
        const services = await specialServiceRepository.findActive();
        return services.map(toFrontend);
    }
    async update(id, data) {
        const existing = await specialServiceRepository.findById(id);
        if (!existing) {
            throw new AppError('Service introuvable', StatusCodes.NOT_FOUND);
        }
        if (data.minElements !== undefined && (!Number.isInteger(data.minElements) || data.minElements < 1)) {
            throw new AppError("minElements doit être un entier supérieur ou égal à 1", StatusCodes.BAD_REQUEST);
        }
        const updated = await specialServiceRepository.update(id, data);
        return toFrontend(updated);
    }
    async addComposant(serviceId, nom) {
        const service = await specialServiceRepository.findById(serviceId);
        if (!service) {
            throw new AppError('Service introuvable', StatusCodes.NOT_FOUND);
        }
        if (!nom || !nom.trim()) {
            throw new AppError('Le nom du composant est requis', StatusCodes.BAD_REQUEST);
        }
        return await specialServiceRepository.createComposant(serviceId, nom.trim());
    }
    async updateComposant(id, data) {
        if (data.nom !== undefined && !data.nom.trim()) {
            throw new AppError('Le nom du composant ne peut pas être vide', StatusCodes.BAD_REQUEST);
        }
        return await specialServiceRepository.updateComposant(id, {
            ...data,
            ...(data.nom !== undefined ? { nom: data.nom.trim() } : {}),
        });
    }
    async deleteComposant(id) {
        return await specialServiceRepository.deleteComposant(id);
    }
}
export default new SpecialServiceService();
//# sourceMappingURL=specialService.service.js.map