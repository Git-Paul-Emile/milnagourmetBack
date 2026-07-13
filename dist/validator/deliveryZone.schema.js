import { z } from 'zod';
export const createDeliveryZoneSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    deliveryFee: z.coerce.number().min(0, 'Les frais de livraison doivent être positifs'),
    estimatedTime: z.string().min(1, 'Le temps estimé est requis'),
    active: z.boolean().optional()
});
export const updateDeliveryZoneSchema = z.object({
    name: z.string().min(1).optional(),
    deliveryFee: z.coerce.number().min(0).optional(),
    estimatedTime: z.string().min(1).optional(),
    active: z.boolean().optional()
});
//# sourceMappingURL=deliveryZone.schema.js.map