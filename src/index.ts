import { env, assertProductionConfig } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectToDatabase, prisma } from "./config/database.js";
import app from "./config/app.js";
import { emailChannel } from "./services/notification/email.channel.js";
import { whatsappChannel } from "./services/notification/whatsapp.channel.js";

/**
 * Point d'entrée du serveur.
 *
 * Ordre volontaire : on vérifie la configuration AVANT d'ouvrir le port.
 * Démarrer un serveur mal configuré est pire que ne pas démarrer du tout :
 * il répond, encaisse des commandes, et perd silencieusement les
 * notifications.
 */
const initializeApp = async () => {
  try {
    // Échoue immédiatement si la configuration de production est incomplète.
    assertProductionConfig();

    await connectToDatabase();

    const PORT = env.PORT;
    const serveur = app.listen(PORT, () => {
      logger.info(
        {
          port: PORT,
          environnement: env.NODE_ENV,
          canalWhatsapp: whatsappChannel.estConfigure(),
          canalEmail: emailChannel.estConfigure(),
        },
        `Serveur démarré sur le port ${PORT}`
      );

      if (!whatsappChannel.estConfigure() && emailChannel.estConfigure()) {
        logger.info(
          "WhatsApp non configuré : toutes les notifications partent par email."
        );
      }
    });

    /**
     * Arrêt propre (graceful shutdown).
     *
     * L'hébergeur envoie SIGTERM avant de couper l'instance. Sans ce
     * traitement, les requêtes en cours sont interrompues brutalement et
     * les connexions à la base restent ouvertes côté serveur PostgreSQL.
     * Ici on cesse d'accepter de nouvelles requêtes, on laisse finir les
     * requêtes en cours, puis on ferme la base.
     */
    const arreterProprement = (signal: string) => {
      logger.info({ signal }, "Arrêt du serveur demandé");
      serveur.close(() => {
        void prisma.$disconnect().finally(() => {
          logger.info("Serveur arrêté proprement");
          process.exit(0);
        });
      });

      // Filet de sécurité : si une requête ne se termine pas, on force
      // l'arrêt au bout de 10 s plutôt que de rester bloqué.
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on("SIGTERM", () => arreterProprement("SIGTERM"));
    process.on("SIGINT", () => arreterProprement("SIGINT"));
  } catch (err) {
    logger.fatal({ err }, "Échec du démarrage de l'application");
    process.exit(1);
  }
};

void initializeApp();
