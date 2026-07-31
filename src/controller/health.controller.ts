import type { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';
import { emailChannel } from '../services/notification/email.channel.js';
import { whatsappChannel } from '../services/notification/whatsapp.channel.js';

/**
 * Sonde de santé.
 *
 * Utilise le client Prisma partagé : instancier un client dédié ici
 * ouvrirait un second pool de connexions consommé pour rien à chaque
 * appel de la sonde (toutes les 30 s en général).
 *
 * Le champ `notifications` permet de vérifier d'un coup d'œil, depuis la
 * production, quel canal est réellement actif — sans exposer la moindre
 * clé ni coordonnée.
 */
export const healthCheck = async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'OK',
      message: 'Le serveur et la base de données sont opérationnels',
      notifications: {
        whatsapp: whatsappChannel.estConfigure(),
        email: emailChannel.estConfigure(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ err: error }, 'Échec du health check');
    res.status(500).json({
      status: 'ERROR',
      message: 'Problème avec le serveur ou la base de données',
      timestamp: new Date().toISOString(),
    });
  }
};
