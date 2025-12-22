import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonResponse } from '../utils/index.js';
import deliveryPersonService from '../services/deliveryPerson.service.js';

class DeliveryPersonController {
  // Récupérer tous les livreurs
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const deliveryPersons = await deliveryPersonService.getAllDeliveryPersons();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Livreurs récupérés avec succès',
          data: deliveryPersons
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer un livreur par ID
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          jsonResponse({
            status: 'error',
            message: 'ID du livreur requis'
          })
        );
      }

      const deliveryPerson = await deliveryPersonService.getDeliveryPersonById(id);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Livreur récupéré avec succès',
          data: deliveryPerson
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Créer un nouveau livreur
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nomComplet, phone, vehicle } = req.body;

      if (!nomComplet || !phone || !vehicle) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          jsonResponse({
            status: 'error',
            message: 'Nom complet, téléphone et véhicule sont requis'
          })
        );
      }

      const deliveryPerson = await deliveryPersonService.createDeliveryPerson({
        nomComplet,
        phone,
        vehicle
      });

      res.status(StatusCodes.CREATED).json(
        jsonResponse({
          status: 'success',
          message: 'Livreur créé avec succès',
          data: deliveryPerson
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour un livreur
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          jsonResponse({
            status: 'error',
            message: 'ID du livreur requis'
          })
        );
      }

      const { nomComplet, phone, vehicle, active } = req.body;

      const deliveryPerson = await deliveryPersonService.updateDeliveryPerson(id, {
        nomComplet,
        phone,
        vehicle,
        active
      });

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Livreur mis à jour avec succès',
          data: deliveryPerson
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un livreur
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          jsonResponse({
            status: 'error',
            message: 'ID du livreur requis'
          })
        );
      }

      await deliveryPersonService.deleteDeliveryPerson(id);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Livreur supprimé avec succès'
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new DeliveryPersonController();