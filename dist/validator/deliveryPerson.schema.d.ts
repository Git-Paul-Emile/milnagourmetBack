import { z } from 'zod';
export declare const createDeliveryPersonSchema: z.ZodObject<{
    nomComplet: z.ZodString;
    phone: z.ZodString;
    vehicle: z.ZodString;
}, z.core.$strip>;
export declare const updateDeliveryPersonSchema: z.ZodObject<{
    nomComplet: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    vehicle: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=deliveryPerson.schema.d.ts.map