import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonResponse } from '../utils/index.js';
import specialServiceService from '../services/specialService.service.js';

class SpecialServiceController {
  // GET /api/services — services actifs (public, affichage catalogue)
  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await specialServiceService.getActive();
      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Services actifs récupérés avec succès',
          data: services,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/services/all — tous les services (admin)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await specialServiceService.getAll();
      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Services récupérés avec succès',
          data: services,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/services/:id — mise à jour (actif, minElements, nom, description, image)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id ?? '', 10);
      const { nom, description, image, actif, minElements } = req.body;
      const service = await specialServiceService.update(id, {
        ...(nom !== undefined ? { nom } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(actif !== undefined ? { actif: Boolean(actif) } : {}),
        ...(minElements !== undefined ? { minElements: parseInt(minElements, 10) } : {}),
      });
      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Service mis à jour avec succès',
          data: service,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // POST /api/services/:id/components — ajouter un composant
  async addComposant(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceId = parseInt(req.params.id ?? '', 10);
      const composant = await specialServiceService.addComposant(serviceId, req.body.nom);
      res.status(StatusCodes.CREATED).json(
        jsonResponse({
          status: 'success',
          message: 'Composant ajouté avec succès',
          data: composant,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/services/components/:componentId — modifier un composant
  async updateComposant(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.componentId ?? '', 10);
      const { nom, disponible } = req.body;
      const composant = await specialServiceService.updateComposant(id, {
        ...(nom !== undefined ? { nom } : {}),
        ...(disponible !== undefined ? { disponible: Boolean(disponible) } : {}),
      });
      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Composant mis à jour avec succès',
          data: composant,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/services/components/:componentId — supprimer un composant
  async deleteComposant(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.componentId ?? '', 10);
      await specialServiceService.deleteComposant(id);
      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Composant supprimé avec succès',
          data: null,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new SpecialServiceController();
