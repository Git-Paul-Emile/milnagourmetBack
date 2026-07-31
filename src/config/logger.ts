import pino from 'pino';
import { env } from './env.js';

/**
 * Journalisation structurée.
 *
 * Pourquoi pas `console.log` ? Une ligne de texte libre n'est pas
 * exploitable par une machine. Un log structuré produit du JSON :
 *
 *   {"level":30,"time":...,"requestId":"a1b2","orderId":42,"msg":"commande créée"}
 *
 * On peut alors filtrer (`level >= 50`), chercher (`orderId=42`), corréler
 * (`requestId`) et déclencher des alertes — impossible avec du texte brut.
 *
 * - En développement : sortie colorée et lisible via pino-pretty.
 * - En production : JSON sur une ligne, directement consommable par
 *   l'agrégateur de logs de l'hébergeur.
 */
const niveauParDefaut = env.NODE_ENV === 'production' ? 'info' : 'debug';

export const logger = pino({
  level: env.LOG_LEVEL ?? (env.NODE_ENV === 'test' ? 'silent' : niveauParDefaut),

  // `redact` remplace la valeur par "[Redacted]" AVANT écriture.
  // Sans cela, un token d'authentification ou un mot de passe finirait en
  // clair dans les fichiers de log — problème de sécurité et de conformité.
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'password',
      '*.password',
      'motDePasse',
      '*.motDePasse',
      'token',
      '*.token',
      'accessToken',
      'refreshToken',
      '*.accessToken',
      '*.refreshToken',
    ],
    censor: '[Redacted]',
  },

  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

export type Logger = typeof logger;
