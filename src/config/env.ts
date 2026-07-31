import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement.
// `quiet` supprime la bannière du chargeur, qui pollue la sortie des tests.
dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

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

  // Journalisation. `silent` coupe totalement la sortie : utile en test
  // et pour un diagnostic ponctuel en production.
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .optional(),

  // CORS
  FRONT_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().optional().default(''),

  // URL publique du site, utilisée pour construire les liens envoyés par
  // email (réinitialisation de mot de passe notamment).
  PUBLIC_APP_URL: z.string().url().default('http://localhost:8080'),

  // ------------------------------------------------------------------
  // Notifications — canal EMAIL (Resend)
  // ------------------------------------------------------------------
  // Canal par défaut tant que WhatsApp Business n'est pas activé côté
  // Telnyx. C'est aussi le seul canal utilisable pour la réinitialisation
  // de mot de passe.
  RESEND_API_KEY: z.string().optional(),
  // Expéditeur : doit appartenir à un domaine vérifié dans Resend.
  MAIL_FROM: z.string().default('Milna Gourmet <contact@milnagourmet.com>'),
  // Boîte du vendeur qui reçoit les nouvelles commandes.
  VENDOR_EMAIL: z.string().email().optional(),

  // ------------------------------------------------------------------
  // Notifications — canal WHATSAPP (Telnyx)
  // ------------------------------------------------------------------
  // Optionnelles : tant qu'elles sont absentes, le service bascule
  // automatiquement sur l'email. Aucune configuration n'est requise ici
  // pour que l'application fonctionne.
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

/**
 * Garde-fou de démarrage en production.
 *
 * Principe : mieux vaut un déploiement qui échoue bruyamment qu'un service
 * qui tourne en perdant silencieusement des commandes. Sans au moins un
 * canal de notification configuré, une commande peut être enregistrée sans
 * que personne ne soit jamais prévenu.
 *
 * Appelée au démarrage (src/index.ts), jamais pendant les tests.
 */
export function assertProductionConfig(): void {
  if (env.NODE_ENV !== 'production') return;

  const erreurs: string[] = [];

  const emailPret = Boolean(env.RESEND_API_KEY && env.VENDOR_EMAIL);
  const whatsappPret = Boolean(
    env.TELNYX_API_KEY && env.TELNYX_WHATSAPP_FROM && env.VENDOR_WHATSAPP_NUMBER
  );

  if (!emailPret && !whatsappPret) {
    erreurs.push(
      "Aucun canal de notification configuré. Renseignez RESEND_API_KEY + VENDOR_EMAIL " +
      "(canal email) ou TELNYX_API_KEY + TELNYX_WHATSAPP_FROM + VENDOR_WHATSAPP_NUMBER (canal WhatsApp)."
    );
  }

  // La réinitialisation de mot de passe passe obligatoirement par email :
  // sans Resend, la fonctionnalité serait inopérante.
  if (!env.RESEND_API_KEY) {
    erreurs.push(
      "RESEND_API_KEY manquante : la réinitialisation de mot de passe ne pourra pas fonctionner."
    );
  }

  if (env.CORS_ORIGINS.trim() === '') {
    erreurs.push("CORS_ORIGINS vide : aucune origine de production autorisée.");
  }

  if (erreurs.length > 0) {
    console.error('❌ Configuration de production incomplète :');
    erreurs.forEach((e) => console.error(`   - ${e}`));
    process.exit(1);
  }
}
