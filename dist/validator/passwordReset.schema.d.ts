import { z } from 'zod';
/**
 * Schémas de validation de la réinitialisation de mot de passe.
 *
 * La validation est la première ligne de défense : elle rejette les
 * requêtes malformées AVANT qu'elles n'atteignent la base de données ou
 * le service d'envoi d'emails.
 */
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
//# sourceMappingURL=passwordReset.schema.d.ts.map