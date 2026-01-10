import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    telephone: z.ZodString;
    nomComplet: z.ZodString;
    zoneLivraisonId: z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    telephone: z.ZodString;
    password: z.ZodString;
    guestCart: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        price: z.ZodNumber;
        quantity: z.ZodNumber;
        image: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    telephone: z.ZodOptional<z.ZodString>;
    deliveryZoneId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
    ancienMotDePasse: z.ZodOptional<z.ZodString>;
    motDePasse: z.ZodOptional<z.ZodString>;
    confirmMotDePasse: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
//# sourceMappingURL=auth.schema.d.ts.map