import type { Request, Response } from 'express';
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
export declare const healthCheck: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=health.controller.d.ts.map