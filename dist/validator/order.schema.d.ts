import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    customer: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        phone: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodNumber;
        quantity: z.ZodNumber;
        image: z.ZodOptional<z.ZodString>;
        product: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
        }, z.core.$loose>>>;
        customCreation: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            size: z.ZodOptional<z.ZodObject<{
                id: z.ZodNumber;
                nom: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>>;
            selectedFruits: z.ZodOptional<z.ZodArray<z.ZodString>>;
            selectedSauces: z.ZodOptional<z.ZodArray<z.ZodString>>;
            selectedCereales: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$loose>>>;
    }, z.core.$strip>>;
    total: z.ZodOptional<z.ZodNumber>;
    deliveryFee: z.ZodOptional<z.ZodNumber>;
    deliveryZoneId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    pointsUsed: z.ZodOptional<z.ZodNumber>;
    pointsDiscount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        RECU: "RECU";
        LIVREE: "LIVREE";
        ANNULEE: "ANNULEE";
        recu: "recu";
        livree: "livree";
        annulee: "annulee";
    }>;
}, z.core.$strip>;
export declare const assignDeliveryPersonSchema: z.ZodObject<{
    livreurId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNull]>>;
}, z.core.$strip>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
//# sourceMappingURL=order.schema.d.ts.map