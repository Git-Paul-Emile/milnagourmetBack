import type { Request, Response, NextFunction } from 'express';
import configService from '../services/config.service.js';
import { jsonResponse } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';

class ConfigController {
  private configService = configService;

  // Récupérer toutes les configurations
  async getAllConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await configService.getAllConfig();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Configurations récupérées avec succès',
          data: config
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer les configurations de statuts
  async getOrderStatusConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await configService.getOrderStatusConfig();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Configurations de statuts récupérées avec succès',
          data: config
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer les traductions de catégories
  async getCategoryTranslations(req: Request, res: Response, next: NextFunction) {
    try {
      const translations = await configService.getCategoryTranslations();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Traductions de catégories récupérées avec succès',
          data: translations
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer les traductions de tailles
  async getSizeTranslations(req: Request, res: Response, next: NextFunction) {
    try {
      const translations = await configService.getSizeTranslations();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Traductions de tailles récupérées avec succès',
          data: translations
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ConfigController();




