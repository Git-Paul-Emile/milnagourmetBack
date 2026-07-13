import { z } from 'zod';
export declare const updateUserSchema: z.ZodObject<{
    blocked: z.ZodOptional<z.ZodBoolean>;
    deliveryZoneId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
//# sourceMappingURL=user.schema.d.ts.map