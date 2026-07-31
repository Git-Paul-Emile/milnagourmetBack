/**
 * Configuration commune à toute la suite de tests.
 *
 * Ce fichier s'exécute AVANT le chargement des modules testés. C'est
 * indispensable ici : `src/config/env.ts` valide les variables au moment
 * de l'import et appelle `process.exit(1)` si l'une manque. Sans ces
 * valeurs posées en amont, la suite entière s'arrêterait au premier
 * import.
 */

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
process.env.CLOUDINARY_URL ??= 'cloudinary://key:secret@cloud';
process.env.ACCESS_TOKEN_SECRET ??= 'secret-de-test-acces-32-caracteres!!';
process.env.REFRESH_TOKEN_SECRET ??= 'secret-de-test-refresh-32-caracteres!';
process.env.BCRYPT_SALT ??= '4'; // coût minimal : bcrypt à 10 rendrait les tests très lents
process.env.FRONT_URL ??= 'http://localhost:8080';
process.env.PUBLIC_APP_URL ??= 'http://localhost:8080';
process.env.MAIL_FROM ??= 'Milna Gourmet <test@milnagourmet.com>';

// Journalisation coupée : le bruit des logs masque les échecs de tests.
process.env.LOG_LEVEL = 'silent';

// Les canaux de notification sont volontairement NON configurés par
// défaut. Chaque test qui en a besoin les active lui-même, ce qui rend
// explicite la configuration testée.
delete process.env.RESEND_API_KEY;
delete process.env.VENDOR_EMAIL;
delete process.env.TELNYX_API_KEY;
delete process.env.TELNYX_WHATSAPP_FROM;
delete process.env.VENDOR_WHATSAPP_NUMBER;
