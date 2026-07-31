import { z } from 'zod';

const guestCartSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string().optional(),
  customCreation: z.object({
    size: z.object({ id: z.number() }).passthrough(),
    selectedFruits: z.array(z.string()).optional(),
    selectedSauces: z.array(z.string()).optional(),
    selectedCereales: z.array(z.string()).optional()
  }).passthrough().optional()
})).optional();

/**
 * Adresse email facultative.
 *
 * L'authentification se fait par téléphone : l'email ne sert qu'aux
 * notifications et à la réinitialisation de mot de passe. Il reste donc
 * optionnel pour ne bloquer personne à l'inscription.
 *
 * La chaîne vide est convertie en `undefined` : un champ de formulaire
 * laissé vide envoie `""`, qui échouerait à la validation `.email()` et
 * violerait par ailleurs la contrainte d'unicité en base.
 */
const emailOptionnelSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Format d'adresse email invalide")
  .optional()
  .or(z.literal('').transform(() => undefined));

export const registerSchema = z.object({
  telephone: z.string()
    .min(1, 'Le téléphone est requis')
    .regex(/^[+]?[\d\s-()]+$/, 'Format de téléphone invalide'),
  email: emailOptionnelSchema,
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
    .min(1, 'La confirmation du mot de passe est requise'),
  guestCart: guestCartSchema
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
  guestCart: guestCartSchema
});

export const updateProfileSchema = z.object({
  nom: z.string()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères')
    .optional(),
  telephone: z.string()
    .regex(/^[+]?[\d\s-()]+$/, 'Format de téléphone invalide')
    .optional(),
  email: emailOptionnelSchema,
  deliveryZoneId: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, 'ID de zone de livraison invalide')
    .optional(),
  ancienMotDePasse: z.string().optional(),
  motDePasse: z.string()
    .min(4, 'Le mot de passe doit contenir au minimum 4 caractères')
    .optional(),
  confirmMotDePasse: z.string().optional()
}).refine((data) => {
  if (data.motDePasse && !data.confirmMotDePasse) return false;
  if (!data.motDePasse && data.confirmMotDePasse) return false;
  return true;
}, {
  message: 'La confirmation du mot de passe est requise si un mot de passe est fourni',
  path: ['confirmMotDePasse']
}).refine((data) => {
  if (data.motDePasse && data.motDePasse !== data.confirmMotDePasse) return false;
  return true;
}, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmMotDePasse']
}).refine((data) => {
  if (data.motDePasse && !data.ancienMotDePasse) return false;
  return true;
}, {
  message: 'L\'ancien mot de passe est requis pour changer de mot de passe',
  path: ['ancienMotDePasse']
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;