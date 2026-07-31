import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonResponse } from '../utils/index.js';
import { PasswordResetService } from '../services/passwordReset.service.js';
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../validator/passwordReset.schema.js';

/**
 * Message de réponse unique à /forgot-password.
 *
 * Il est volontairement neutre : il ne dit ni « compte trouvé » ni
 * « compte inconnu ». Deux réponses différentes transformeraient
 * l'endpoint en outil d'énumération des clients (on saurait qui a un
 * compte chez vous simplement en testant des adresses).
 */
const MESSAGE_NEUTRE =
  "Si un compte est associé à cette adresse, un email de réinitialisation vient d'être envoyé. Pensez à vérifier vos indésirables.";

class PasswordResetController {
  /** POST /api/auth/forgot-password */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as ForgotPasswordInput;

      await PasswordResetService.demanderReinitialisation(email);

      res.status(StatusCodes.OK).json(
        jsonResponse({ status: 'success', message: MESSAGE_NEUTRE })
      );
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/auth/reset-password */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body as ResetPasswordInput;

      await PasswordResetService.reinitialiser(token, password);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message:
            'Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.',
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new PasswordResetController();
