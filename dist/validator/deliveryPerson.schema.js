import { z } from 'zod';
export const createDeliveryPersonSchema = z.object({
    nomComplet: z.string().min(1, 'Le nom complet est requis'),
    phone: z.string().min(1, 'Le téléphone est requis'),
    vehicle: z.string().min(1, 'Le véhicule est requis')
});
export const updateDeliveryPersonSchema = z.object({
    nomComplet: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    vehicle: z.string().min(1).optional(),
    active: z.boolean().optional()
});
//# sourceMappingURL=deliveryPerson.schema.js.map