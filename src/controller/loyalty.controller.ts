import type { Request, Response, NextFunction } from 'express';
import { jsonResponse, AppError } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { LoyaltyService } from '../services/loyalty.service.js';

class LoyaltyController {

  // Récupérer le solde de points de l'utilisateur connecté
  async getUserPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
      }

      const points = await LoyaltyService.getUserPoints(parseInt(userId));
      const pointsValue = LoyaltyService.pointsToCFA(points);
      const canUsePoints = LoyaltyService.canUsePoints(points);
      const progressPercentage = LoyaltyService.getProgressPercentage(points);
      const pointsToNextThreshold = LoyaltyService.getPointsToNextThreshold(points);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Points de fidélité récupérés avec succès',
          data: {
            points,
            pointsValue,
            canUsePoints,
            progressPercentage,
            pointsToNextThreshold,
            nextThresholdValue: LoyaltyService.pointsToCFA(100) // 1500 F
          }
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer l'historique des points de l'utilisateur connecté
  async getUserPointsHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
      }

      const history = await LoyaltyService.getUserPointsHistory(parseInt(userId));

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Historique des points récupéré avec succès',
          data: history
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Utiliser des points pour une remise (sera appelé lors de l'application au panier)
  async usePoints(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
      }

      const { pointsToUse } = req.body;
      if (!pointsToUse || pointsToUse <= 0) {
        throw new AppError('Nombre de points invalide', StatusCodes.BAD_REQUEST);
      }

      const discountAmount = await LoyaltyService.usePoints(parseInt(userId), pointsToUse);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Points utilisés avec succès',
          data: {
            discountAmount,
            pointsUsed: pointsToUse
          }
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Calculer les points pour un montant (utile pour l'affichage)
  async calculatePoints(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.query;
      if (!amount || isNaN(Number(amount))) {
        throw new AppError('Montant invalide', StatusCodes.BAD_REQUEST);
      }

      const points = LoyaltyService.calculatePoints(Number(amount));
      const pointsValue = LoyaltyService.pointsToCFA(points);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Calcul des points effectué',
          data: {
            amount: Number(amount),
            points,
            pointsValue
          }
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new LoyaltyController();