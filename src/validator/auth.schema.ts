import { z } from 'zod';

export const registerSchema = z.object({
  telephone: z.string()
    .min(1, 'Le téléphone est requis')
    .regex(/^[+]?[\d\s-()]+$/, 'Format de téléphone invalide'),
  nomComplet: z.string()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères'),
  zoneLivraisonId: z.string()
    .min(1, 'La zone de livraison est requise')
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, 'ID de zone de livraison invalide'),
  password: z.string()
    .min(4, 'Le mot de passe doit contenir au minimum 4 caractères'),
  confirmPassword: z.string()
    .min(1, 'La confirmation du mot de passe est requise')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  telephone: z.string()
    .min(1, 'Le téléphone est requis')
    .regex(/^[+]?[\d\s-()]+$/, 'Format de téléphone invalide'),
  password: z.string()
    .min(1, 'Le mot de passe est requis'),
  guestCart: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    image: z.string().optional()
  })).optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;