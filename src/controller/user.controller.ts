import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { jsonResponse, buildPaginationMeta } from '../utils/index.js';
import { AppError } from '../utils/AppError.js';
import userService from '../services/user.service.js';
import { userQuerySchema } from '../validator/query.schema.js';

class UserController {
  // Récupérer tous les utilisateurs (pagination/recherche/filtre/tri optionnels via query params)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = userQuerySchema.parse(req.query);
      const { page, limit, search, sortBy, sortOrder } = query;
      const blocked = query.blocked !== undefined ? query.blocked === 'true' : undefined;

      const { items: users, total } = await userService.getAllUsers({
        page,
        limit,
        search,
        blocked,
        sortBy,
        sortOrder
      });

      const isPaginated = page !== undefined && limit !== undefined;

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Utilisateurs récupérés avec succès',
          data: users,
          meta: isPaginated ? buildPaginationMeta(page, limit, total) : undefined
        })
      );
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST));
      } else {
        next(error);
      }
    }
  }

  // Mettre à jour un utilisateur (bloquer / débloquer / zone)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError('ID utilisateur requis', StatusCodes.BAD_REQUEST);
      }
      const updatedUser = await userService.updateUser(id, req.body);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Utilisateur mis à jour avec succès',
          data: updatedUser
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un utilisateur
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError('ID utilisateur requis', StatusCodes.BAD_REQUEST);
      }
      await userService.deleteUser(id);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Utilisateur supprimé avec succès',
          data: null
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();