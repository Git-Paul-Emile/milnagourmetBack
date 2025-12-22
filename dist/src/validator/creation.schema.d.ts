import { z } from 'zod';
export declare const FruitCreateSchema: z.ZodObject<{
    nom: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    disponible: z.ZodDefault<z.ZodBoolean>;
    ordreAffichage: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const FruitUpdateSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    disponible: z.ZodOptional<z.ZodBoolean>;
    ordreAffichage: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const SauceCreateSchema: z.ZodObject<{
    nom: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    disponible: z.ZodDefault<z.ZodBoolean>;
    ordreAffichage: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const SauceUpdateSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    disponible: z.ZodOptional<z.ZodBoolean>;
    ordreAffichage: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const CerealeCreateSchema: z.ZodObject<{
    nom: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    disponible: z.ZodDefault<z.ZodBoolean>;
    ordreAffichage: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const CerealeUpdateSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    disponible: z.ZodOptional<z.ZodBoolean>;
    ordreAffichage: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const TailleCreationCreateSchema: z.ZodObject<{
    nom: z.ZodString;
    prix: z.ZodNumber;
    maxFruits: z.ZodNumber;
    maxSauces: z.ZodNumber;
    cerealesAutorise: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
    ordreAffichage: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const TailleCreationUpdateSchema: z.ZodObject<{
    nom: z.ZodOptional<z.ZodString>;
    prix: z.ZodOptional<z.ZodNumber>;
    maxFruits: z.ZodOptional<z.ZodNumber>;
    maxSauces: z.ZodOptional<z.ZodNumber>;
    cerealesAutorise: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
    ordreAffichage: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type FruitCreate = z.infer<typeof FruitCreateSchema>;
export type FruitUpdate = z.infer<typeof FruitUpdateSchema>;
export type SauceCreate = z.infer<typeof SauceCreateSchema>;
export type SauceUpdate = z.infer<typeof SauceUpdateSchema>;
export type CerealeCreate = z.infer<typeof CerealeCreateSchema>;
export type CerealeUpdate = z.infer<typeof CerealeUpdateSchema>;
export type TailleCreationCreate = z.infer<typeof TailleCreationCreateSchema>;
export type TailleCreationUpdate = z.infer<typeof TailleCreationUpdateSchema>;
//# sourceMappingURL=creation.schema.d.ts.map