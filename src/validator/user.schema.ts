import { z } from 'zod';

export const updateUserSchema = z.object({
  blocked: z.boolean().optional(),
  deliveryZoneId: z.string().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
