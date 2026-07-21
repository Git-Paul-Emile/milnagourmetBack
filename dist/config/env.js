import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env') });
const envSchema = z.object({
    // Server
    PORT: z.string().default('3000').transform(Number),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    // Cloudinary (stockage des médias)
    CLOUDINARY_URL: z.string().min(1, "CLOUDINARY_URL is required"),
    // Security
    ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
    REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
    BCRYPT_SALT: z.string().default('10').transform(Number),
    // Token Expiry
    ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
    // CORS
    FRONT_URL: z.string().url().default('http://localhost:5173'),
    CORS_ORIGINS: z.string().optional().default(''),
    // Telnyx / WhatsApp (envoi des notifications de commande)
    // Toutes optionnelles : sans elles, les notifications sont ignorées en
    // silence, le reste de l'application fonctionne normalement.
    TELNYX_API_KEY: z.string().optional(),
    TELNYX_BASE_URL: z.string().default('https://api.telnyx.com/v2'),
    TELNYX_WHATSAPP_FROM: z.string().optional(), // numéro WhatsApp Business expéditeur
    TELNYX_MESSAGING_PROFILE_ID: z.string().optional(),
    TELNYX_MESSAGE_TYPE: z.string().optional(), // laisser vide en général
    VENDOR_WHATSAPP_NUMBER: z.string().optional(), // destinataire vendeur
});
// Valider et exporter
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
    process.exit(1);
}
export const env = parsedEnv.data;
//# sourceMappingURL=env.js.map