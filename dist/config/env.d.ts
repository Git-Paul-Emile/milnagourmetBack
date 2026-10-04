export declare const env: {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    CLOUDINARY_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    BCRYPT_SALT: number;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    FRONT_URL: string;
    CORS_ORIGINS: string;
    PUBLIC_APP_URL: string;
    MAIL_FROM: string;
    VENDOR_EMAIL: string;
    TELNYX_BASE_URL: string;
    LOG_LEVEL?: "error" | "fatal" | "warn" | "info" | "debug" | "trace" | "silent" | undefined;
    RESEND_API_KEY?: string | undefined;
    TELNYX_API_KEY?: string | undefined;
    TELNYX_WHATSAPP_FROM?: string | undefined;
    TELNYX_MESSAGING_PROFILE_ID?: string | undefined;
    TELNYX_MESSAGE_TYPE?: string | undefined;
    VENDOR_WHATSAPP_NUMBER?: string | undefined;
};
/**
 * Garde-fou de démarrage en production.
 *
 * Principe : mieux vaut un déploiement qui échoue bruyamment qu'un service
 * qui tourne en perdant silencieusement des commandes. Sans au moins un
 * canal de notification configuré, une commande peut être enregistrée sans
 * que personne ne soit jamais prévenu.
 *
 * Le canal de notification (email/WhatsApp) est en avertissement non-bloquant
 * le temps que le compte Resend soit créé — seul CORS_ORIGINS vide bloque
 * encore le démarrage, car c'est une faille de sécurité et non une
 * fonctionnalité manquante.
 *
 * Appelée au démarrage (src/index.ts), jamais pendant les tests.
 */
export declare function assertProductionConfig(): void;
//# sourceMappingURL=env.d.ts.map