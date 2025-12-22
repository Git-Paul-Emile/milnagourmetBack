import { verifyAccessToken } from '../config/jwt.js';
import { AppError } from './AppError.js';
import { StatusCodes } from 'http-status-codes';
export const requireAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
        if (!token) {
            throw new AppError('Token d\'authentification manquant', StatusCodes.UNAUTHORIZED);
        }
        const decoded = verifyAccessToken(token);
        // Vérifier que l'utilisateur a le rôle ADMIN
        if (decoded.role !== 'ADMIN') {
            throw new AppError('Accès refusé - droits administrateur requis', StatusCodes.FORBIDDEN);
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof AppError) {
            next(error);
        }
        else {
            next(new AppError('Token invalide', StatusCodes.UNAUTHORIZED));
        }
    }
};
//# sourceMappingURL=admin.middleware.js.map