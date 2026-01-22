import { prisma } from '../config/database.js';
export class LoyaltyService {
    static CFA_PER_POINT = 15; // 1 point = 15 F de remise
    static POINTS_PER_CFA = 1 / this.CFA_PER_POINT; // Environ 0.0667 points par F
    static MIN_POINTS_FOR_DISCOUNT = 100; // Seuil minimum
    /**
     * Calcule les points gagnés pour un montant TTC
     */
    static calculatePoints(amountTTC) {
        return Math.round(amountTTC * this.POINTS_PER_CFA * 100) / 100;
    }
    /**
     * Convertit les points en valeur CFA
     */
    static pointsToCFA(points) {
        return points * this.CFA_PER_POINT;
    }
    /**
     * Convertit une valeur CFA en points
     */
    static cfaToPoints(amount) {
        return amount / this.CFA_PER_POINT;
    }
    /**
     * Vérifie si l'utilisateur peut utiliser ses points
     */
    static canUsePoints(points) {
        return points >= this.MIN_POINTS_FOR_DISCOUNT;
    }
    /**
     * Ajoute des points à un utilisateur après une commande
     */
    static async addPoints(userId, orderId, amountTTC) {
        const points = this.calculatePoints(amountTTC);
        if (points <= 0)
            return;
        // Utiliser une transaction pour s'assurer de la cohérence
        await prisma.$transaction(async (tx) => {
            // Ajouter les points à l'utilisateur
            await tx.utilisateur.update({
                where: { id: userId },
                data: {
                    pointsFidelite: {
                        increment: points
                    }
                }
            });
            // Enregistrer dans l'historique
            await tx.historiquePoints.create({
                data: {
                    utilisateurId: userId,
                    type: 'GAIN',
                    points,
                    montant: amountTTC,
                    description: `Points gagnés sur commande #${orderId}`,
                    commandeId: orderId
                }
            });
        });
    }
    /**
     * Utilise des points pour une remise
     */
    static async usePoints(userId, pointsToUse, orderId) {
        const user = await prisma.utilisateur.findUnique({
            where: { id: userId },
            select: { pointsFidelite: true }
        });
        const userPoints = Number(user?.pointsFidelite) || 0;
        if (!user || !this.canUsePoints(userPoints)) {
            throw new Error('Points insuffisants ou seuil non atteint');
        }
        const pointsAvailable = Math.min(pointsToUse, userPoints);
        const discountAmount = this.pointsToCFA(pointsAvailable);
        // Utiliser une transaction
        await prisma.$transaction(async (tx) => {
            // Déduire les points
            await tx.utilisateur.update({
                where: { id: userId },
                data: {
                    pointsFidelite: {
                        decrement: pointsAvailable
                    }
                }
            });
            // Enregistrer dans l'historique
            await tx.historiquePoints.create({
                data: {
                    utilisateurId: userId,
                    type: 'UTILISATION',
                    points: -pointsAvailable, // Négatif pour les utilisations
                    montant: discountAmount,
                    description: `Remise fidélité utilisée${orderId ? ` sur commande #${orderId}` : ''}`,
                    commandeId: orderId
                }
            });
        });
        return discountAmount;
    }
    /**
     * Récupère le solde de points d'un utilisateur
     */
    static async getUserPoints(userId) {
        const user = await prisma.utilisateur.findUnique({
            where: { id: userId },
            select: { pointsFidelite: true }
        });
        return Number(user?.pointsFidelite) || 0;
    }
    /**
     * Récupère l'historique des points d'un utilisateur
     */
    static async getUserPointsHistory(userId) {
        const history = await prisma.historiquePoints.findMany({
            where: { utilisateurId: userId },
            include: {
                commande: {
                    select: {
                        numeroCommande: true,
                        montantTotal: true
                    }
                }
            },
            orderBy: { creeLe: 'desc' }
        });
        return history.map(entry => ({
            id: entry.id,
            type: entry.type,
            points: Number(entry.points),
            amount: Number(entry.montant),
            description: entry.description,
            orderNumber: entry.commande?.numeroCommande,
            date: entry.creeLe
        }));
    }
    /**
     * Calcule le pourcentage de progression vers le seuil
     */
    static getProgressPercentage(points) {
        if (points >= this.MIN_POINTS_FOR_DISCOUNT)
            return 100;
        return Math.min((points / this.MIN_POINTS_FOR_DISCOUNT) * 100, 100);
    }
    /**
     * Calcule les points restants pour atteindre le seuil
     */
    static getPointsToNextThreshold(points) {
        if (points >= this.MIN_POINTS_FOR_DISCOUNT)
            return 0;
        return this.MIN_POINTS_FOR_DISCOUNT - points;
    }
}
//# sourceMappingURL=loyalty.service.js.map