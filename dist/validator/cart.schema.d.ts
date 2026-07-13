import { z } from 'zod';
export declare const addToCartSchema: z.ZodObject<{
    productId: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export declare const updateCartItemSchema: z.ZodObject<{
    productId: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export declare const addCustomCreationSchema: z.ZodObject<{
    tailleId: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
    fruits: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sauces: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cereales: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const updateCustomCreationSchema: z.ZodObject<{
    creationId: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    quantity: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    fruits: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sauces: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cereales: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const checkoutSchema: z.ZodObject<{
    pointsUsed: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=cart.schema.d.ts.map