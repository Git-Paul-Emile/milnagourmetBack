import specialServiceRepository from '../repository/specialService.repository.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

// Format renvoyé au frontend
function toFrontend(service: {
  id: number;
  code: string;
  nom: string;
  description: string | null;
  image: string | null;
  actif: boolean;
  typeService: string;
  prixBase: number;
  covers: string[];
  minElements: number;
  produit: { id: number; nom: string; prix: number; categorie: string; disponible: boolean } | null;
  composants: { id: number; nom: string; image: string | null; disponible: boolean; parDefaut: boolean; quantiteDefaut: number }[];
}) {
  return {
    id: service.id,
    code: service.code,
    name: service.nom,
    description: service.description,
    image: service.image,
    active: service.actif,
    serviceType: service.typeService,
    basePrice: service.prixBase,
    covers: service.covers ?? [],
    minElements: service.minElements,
    // Produit caché lié : nécessaire côté front pour créer la ligne de commande
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
      image: c.image,
      available: c.disponible,
      isDefault: c.parDefaut,
      defaultQuantity: c.quantiteDefaut,
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

  async update(
    id: number,
    data: {
      nom?: string;
      description?: string;
      image?: string;
      actif?: boolean;
      minElements?: number;
      prixBase?: number;
      typeService?: string;
    }
  ) {
    const existing = await specialServiceRepository.findById(id);
    if (!existing) {
      throw new AppError('Service introuvable', StatusCodes.NOT_FOUND);
    }
    if (data.minElements !== undefined && (!Number.isInteger(data.minElements) || data.minElements < 1)) {
      throw new AppError("minElements doit être un entier supérieur ou égal à 1", StatusCodes.BAD_REQUEST);
    }
    if (data.prixBase !== undefined && (!Number.isInteger(data.prixBase) || data.prixBase < 0)) {
      throw new AppError('prixBase doit être un entier positif ou nul', StatusCodes.BAD_REQUEST);
    }
    const TYPES = ['PANIER_FIXE', 'PANIER_PERSO', 'MONO_SAVEUR', 'ASSORTIMENT'];
    if (data.typeService !== undefined && !TYPES.includes(data.typeService)) {
      throw new AppError(`typeService doit être l'un de : ${TYPES.join(', ')}`, StatusCodes.BAD_REQUEST);
    }
    const updated = await specialServiceRepository.update(id, data);
    return toFrontend(updated);
  }

  async addComposant(serviceId: number, nom: string) {
    const service = await specialServiceRepository.findById(serviceId);
    if (!service) {
      throw new AppError('Service introuvable', StatusCodes.NOT_FOUND);
    }
    if (!nom || !nom.trim()) {
      throw new AppError('Le nom du composant est requis', StatusCodes.BAD_REQUEST);
    }
    return await specialServiceRepository.createComposant(serviceId, nom.trim());
  }

  async updateComposant(
    id: number,
    data: { nom?: string; image?: string; disponible?: boolean; parDefaut?: boolean; quantiteDefaut?: number }
  ) {
    if (data.nom !== undefined && !data.nom.trim()) {
      throw new AppError('Le nom du composant ne peut pas être vide', StatusCodes.BAD_REQUEST);
    }
    if (data.quantiteDefaut !== undefined && (!Number.isInteger(data.quantiteDefaut) || data.quantiteDefaut < 0)) {
      throw new AppError('quantiteDefaut doit être un entier positif ou nul', StatusCodes.BAD_REQUEST);
    }
    return await specialServiceRepository.updateComposant(id, {
      ...data,
      ...(data.nom !== undefined ? { nom: data.nom.trim() } : {}),
    });
  }

  async deleteComposant(id: number) {
    return await specialServiceRepository.deleteComposant(id);
  }
}

export default new SpecialServiceService();
