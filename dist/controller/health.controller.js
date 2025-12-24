import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const healthCheck = async (req, res) => {
    try {
        // Vérifiez la connexion à la DB (optionnel, mais recommandé)
        await prisma.$queryRaw `SELECT 1`; // Une requête simple pour tester la DB
        res.status(200).json({
            status: 'OK',
            message: 'Le serveur et la base de données sont opérationnels',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('Erreur de health check:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Problème avec le serveur ou la base de données',
            timestamp: new Date().toISOString(),
        });
    }
};
//# sourceMappingURL=health.controller.js.map