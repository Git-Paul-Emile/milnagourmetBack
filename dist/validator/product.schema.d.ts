import { z } from 'zod';
export declare const ProductCreateSchema: z.ZodObject<{
    nom: z.ZodString;
    categorie: z.ZodEnum<{
        CREMEUX: "CREMEUX";
        LIQUIDE: "LIQUIDE";
        CREATION: "CREATION";
    }>;
    categorieId: z.ZodOptional<z.ZodNumber>;
    prix: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    disponible: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const ProductUpdateSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    categorie: z.ZodOptional<z.ZodEnum<{
        CREMEUX: "CREMEUX";
        LIQUIDE: "LIQUIDE";
        CREATION: "CREATION";
    }>>;
    categorieId: z.ZodOptional<z.ZodNumber>;
    prix: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    disponible: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
//# sourceMappingURL=product.schema.d.ts.map