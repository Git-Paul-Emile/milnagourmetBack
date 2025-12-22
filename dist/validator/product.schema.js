import { z } from 'zod';
export const ProductCreateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    categorie: z.enum(['CREMEUX', 'LIQUIDE', 'CREATION']),
    categorieId: z.number().int().positive().optional(),
    prix: z.number().int().min(0, 'Le prix doit être positif'),
    description: z.string()
        .max(500, 'La description ne peut pas dépasser 500 caractères')
        .optional(),
    image: z.string('L\'URL de l\'image n\'est pas valide').optional(),
    disponible: z.boolean().default(true)
});
export const ProductUpdateSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .optional(),
    categorie: z.enum(['CREMEUX', 'LIQUIDE', 'CREATION']).optional(),
    categorieId: z.number().int().positive().optional(),
    prix: z.number().int().min(0, 'Le prix doit être positif').optional(),
    description: z.string()
        .max(500, 'La description ne peut pas dépasser 500 caractères')
        .optional(),
    image: z.string('L\'URL de l\'image n\'est pas valide').optional(),
    disponible: z.boolean().optional()
});
//# sourceMappingURL=product.schema.js.map