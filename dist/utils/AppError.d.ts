/**
 * AppError : Classe personnalisée pour les erreurs métier
 * Permet de lancer des erreurs avec un code HTTP et un message
 */
export declare class AppError extends Error {
    message: string;
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
//# sourceMappingURL=AppError.d.ts.map