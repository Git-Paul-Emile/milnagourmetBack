import { PrismaClient } from "@prisma/client";
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
declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const connectToDatabase: () => Promise<void>;
export { prisma };
//# sourceMappingURL=database.d.ts.map