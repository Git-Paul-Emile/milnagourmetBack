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
    // Twilio / WhatsApp
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_WHATSAPP_NUMBER: z.string().optional(),
    VENDOR_WHATSAPP_NUMBER: z.string().optional(),
});
// Valider et exporter
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
    process.exit(1);
}
export const env = parsedEnv.data;
//# sourceMappingURL=env.js.map