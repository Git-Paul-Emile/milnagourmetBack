import { z } from 'zod';
export declare const createDeliveryZoneSchema: z.ZodObject<{
    name: z.ZodString;
    deliveryFee: z.ZodCoercedNumber<unknown>;
    estimatedTime: z.ZodString;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateDeliveryZoneSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    deliveryFee: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    estimatedTime: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=deliveryZone.schema.d.ts.map