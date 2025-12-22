import { z } from 'zod';
// Schémas pour les fruits
export const FruitCreateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    image: z.string().optional(),
    disponible: z.boolean().default(true),
    ordreAffichage: z.number().int().default(0)
});
export const FruitUpdateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .optional(),
    image: z.string().optional(),
    disponible: z.boolean().optional(),
    ordreAffichage: z.number().int().optional()
});
// Schémas pour les sauces
export const SauceCreateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    image: z.string().optional(),
    disponible: z.boolean().default(true),
    ordreAffichage: z.number().int().default(0)
});
export const SauceUpdateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .optional(),
    image: z.string().optional(),
    disponible: z.boolean().optional(),
    ordreAffichage: z.number().int().optional()
});
// Schémas pour les céréales
export const CerealeCreateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    image: z.string().optional(),
    disponible: z.boolean().default(true),
    ordreAffichage: z.number().int().default(0)
});
export const CerealeUpdateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .optional(),
    image: z.string().optional(),
    disponible: z.boolean().optional(),
    ordreAffichage: z.number().int().optional()
});
// Schémas pour les tailles de création
export const TailleCreationCreateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    prix: z.number().int().positive('Le prix doit être positif'),
    maxFruits: z.number().int().min(0, 'Le maximum de fruits doit être positif ou nul'),
    maxSauces: z.number().int().min(0, 'Le maximum de sauces doit être positif ou nul'),
    cerealesAutorise: z.boolean().default(false),
    active: z.boolean().default(true),
    ordreAffichage: z.number().int().default(0)
});
export const TailleCreationUpdateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .optional(),
    prix: z.number().int().positive('Le prix doit être positif').optional(),
    maxFruits: z.number().int().min(0, 'Le maximum de fruits doit être positif ou nul').optional(),
    maxSauces: z.number().int().min(0, 'Le maximum de sauces doit être positif ou nul').optional(),
    cerealesAutorise: z.boolean().optional(),
    active: z.boolean().optional(),
    ordreAffichage: z.number().int().optional()
});
//# sourceMappingURL=creation.schema.js.map