import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonResponse } from '../utils/index.js';
import deliveryZoneService from '../services/deliveryZone.service.js';

class DeliveryZoneController {
  // Récupérer toutes les zones de livraison
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const zones = await deliveryZoneService.getAllDeliveryZones();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Zones de livraison récupérées avec succès',
          data: zones
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer toutes les zones de livraison actives
  async getAllActive(req: Request, res: Response, next: NextFunction) {
    try {
      const zones = await deliveryZoneService.getAllActive();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Zones de livraison actives récupérées avec succès',
          data: zones
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer toutes les zones de livraison avec comptages de commandes
  async getAllWithOrderCounts(req: Request, res: Response, next: NextFunction) {
    try {
      const zones = await deliveryZoneService.getAllDeliveryZonesWithOrderCounts();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Zones de livraison avec comptages récupérées avec succès',
          data: zones
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer une zone de livraison par ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id || '');
      if (isNaN(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          jsonResponse({
            status: 'error',
            message: 'ID de zone de livraison invalide'
          })
        );
      }

      const zone = await deliveryZoneService.getDeliveryZoneById(id);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Zone de livraison récupérée avec succès',
          data: zone
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Créer une nouvelle zone de livraison
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, deliveryFee, estimatedTime, active } = req.body;

      if (!name || !deliveryFee || !estimatedTime) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          jsonResponse({
            status: 'error',
            message: 'Nom, frais de livraison et temps estimé sont requis'
          })
        );
      }

      const zone = await deliveryZoneService.createDeliveryZone({
        name,
        deliveryFee: parseInt(deliveryFee),
        estimatedTime,
        active: active !== undefined ? Boolean(active) : undefined
      });

      res.status(StatusCodes.CREATED).json(
        jsonResponse({
          status: 'success',
          message: 'Zone de livraison créée avec succès',
          data: zone
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour une zone de livraison
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id || '');
      if (isNaN(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          jsonResponse({
            status: 'error',
            message: 'ID de zone de livraison invalide'
          })
        );
      }

      const { name, deliveryFee, estimatedTime, active } = req.body;

      const zone = await deliveryZoneService.updateDeliveryZone(id, {
        name,
        deliveryFee: deliveryFee ? parseInt(deliveryFee) : undefined,
        estimatedTime,
        active: active !== undefined ? Boolean(active) : undefined
      });

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Zone de livraison mise à jour avec succès',
          data: zone
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Supprimer une zone de livraison
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id || '');
      if (isNaN(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          jsonResponse({
            status: 'error',
            message: 'ID de zone de livraison invalide'
          })
        );
      }

      await deliveryZoneService.deleteDeliveryZone(id);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Zone de livraison supprimée avec succès'
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new DeliveryZoneController();