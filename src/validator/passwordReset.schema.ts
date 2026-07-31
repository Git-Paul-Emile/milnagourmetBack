import { z } from 'zod';

/**
 * Schémas de validation de la réinitialisation de mot de passe.
 *
 * La validation est la première ligne de défense : elle rejette les
 * requêtes malformées AVANT qu'elles n'atteignent la base de données ou
 * le service d'envoi d'emails.
 */

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L'adresse email est requise")
    .email("Format d'adresse email invalide")
    // Normalisation en minuscules : les adresses email sont
    // insensibles à la casse en pratique, et cela évite qu'un même
    // compte soit joignable sous plusieurs graphies.
    .transform((valeur) => valeur.toLowerCase()),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, 'Le jeton de réinitialisation est requis'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères'),
    confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
