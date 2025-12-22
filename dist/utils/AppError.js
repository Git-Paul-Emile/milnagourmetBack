import { StatusCodes } from "http-status-codes";
/**
 * AppError : Classe personnalisée pour les erreurs métier
 * Permet de lancer des erreurs avec un code HTTP et un message
 */
export class AppError extends Error {
    message;
    statusCode;
    isOperational;
    constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
//# sourceMappingURL=AppError.js.map