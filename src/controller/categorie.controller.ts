import type { Request, Response, NextFunction } from 'express';
import categorieService from '../services/categorie.service.js';
import { jsonResponse, AppError } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';

class CategorieController {
  private categorieService = categorieService;

  // Créer une nouvelle catégorie
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const categorie = await categorieService.create(req.body);

      res.status(StatusCodes.CREATED).json(
        jsonResponse({
          status: 'success',
          message: 'Catégorie créée avec succès',
          data: categorie
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer toutes les catégories
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categorieService.findAll();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: `${categories.length} catégorie(s) trouvée(s)`,
          data: categories
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer une catégorie par ID
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id!);
      if (isNaN(id)) {
        throw new AppError('ID de catégorie invalide', StatusCodes.BAD_REQUEST);
      }

      const categorie = await categorieService.findById(id);
      if (!categorie) {
        throw new AppError('Catégorie non trouvée', StatusCodes.NOT_FOUND);
      }

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Catégorie trouvée',
          data: categorie
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour une catégorie
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id!);
      if (isNaN(id)) {
        throw new AppError('ID de catégorie invalide', StatusCodes.BAD_REQUEST);
      }

      const categorie = await categorieService.update(id, req.body);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Catégorie mise à jour avec succès',
          data: categorie
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Supprimer une catégorie
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id!);
      if (isNaN(id)) {
        throw new AppError('ID de catégorie invalide', StatusCodes.BAD_REQUEST);
      }

      const categorie = await categorieService.delete(id);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Catégorie supprimée avec succès',
          data: categorie
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new CategorieController();