import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonResponse } from '../utils/index.js';
import pwaService from '../services/pwa.service.js';

class PwaController {
  // Enregistrer un scan de QR code ou une installation (public)
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await pwaService.enregistrerEvenement(req.body);
      res.status(StatusCodes.CREATED).json(
        jsonResponse({ status: 'success', message: 'Événement enregistré' })
      );
    } catch (error) {
      next(error);
    }
  }

  // Statistiques d'installation (ADMIN)
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await pwaService.obtenirStatistiques();
      res.status(StatusCodes.OK).json(
        jsonResponse({ status: 'success', message: 'Statistiques PWA récupérées', data: stats })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new PwaController();
