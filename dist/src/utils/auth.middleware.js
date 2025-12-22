import { verifyAccessToken } from '../config/jwt.js';
import { AppError } from './AppError.js';
import { StatusCodes } from 'http-status-codes';
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
        if (!token) {
            throw new AppError('Token d\'authentification manquant', StatusCodes.UNAUTHORIZED);
        }
        const decoded = verifyAccessToken(token);
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
//# sourceMappingURL=auth.middleware.js.map