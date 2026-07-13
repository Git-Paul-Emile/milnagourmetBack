import { z } from 'zod';
export const updateUserSchema = z.object({
    blocked: z.boolean().optional(),
    deliveryZoneId: z.string().optional()
});
//# sourceMappingURL=user.schema.js.map