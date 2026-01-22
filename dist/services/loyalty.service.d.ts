export declare class LoyaltyService {
    private static readonly CFA_PER_POINT;
    private static readonly POINTS_PER_CFA;
    private static readonly MIN_POINTS_FOR_DISCOUNT;
    /**
     * Calcule les points gagnés pour un montant TTC
     */
    static calculatePoints(amountTTC: number): number;
    /**
     * Convertit les points en valeur CFA
     */
    static pointsToCFA(points: number): number;
    /**
     * Convertit une valeur CFA en points
     */
    static cfaToPoints(amount: number): number;
    /**
     * Vérifie si l'utilisateur peut utiliser ses points
     */
    static canUsePoints(points: number): boolean;
    /**
     * Ajoute des points à un utilisateur après une commande
     */
    static addPoints(userId: number, orderId: number, amountTTC: number): Promise<void>;
    /**
     * Utilise des points pour une remise
     */
    static usePoints(userId: number, pointsToUse: number, orderId?: number): Promise<number>;
    /**
     * Récupère le solde de points d'un utilisateur
     */
    static getUserPoints(userId: number): Promise<number>;
    /**
     * Récupère l'historique des points d'un utilisateur
     */
    static getUserPointsHistory(userId: number): Promise<any[]>;
    /**
     * Calcule le pourcentage de progression vers le seuil
     */
    static getProgressPercentage(points: number): number;
    /**
     * Calcule les points restants pour atteindre le seuil
     */
    static getPointsToNextThreshold(points: number): number;
}
//# sourceMappingURL=loyalty.service.d.ts.map