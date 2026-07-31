import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

/**
 * Client Prisma partagé (singleton).
 *
 * Chaque `new PrismaClient()` ouvre son PROPRE pool de connexions
 * PostgreSQL. Les hébergeurs limitent le nombre de connexions simultanées
 * (souvent quelques dizaines sur les offres d'entrée) : instancier le
 * client à plusieurs endroits épuise ce quota et provoque des erreurs
 * « too many connections » sous charge.
 *
 * Tout le code doit donc importer CETTE instance, jamais en créer une.
 */
const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info("Connecté à la base de données principale");
  } catch (err) {
    logger.fatal({ err }, "Impossible de se connecter à la base de données");
    throw err;
  }
};

export { prisma };
