import { type Mock } from 'vitest';
/**
 * Double de test du client Prisma.
 *
 * POURQUOI NE PAS UTILISER UNE VRAIE BASE ?
 * Un test unitaire doit être rapide, déterministe et exécutable sans
 * infrastructure. Brancher PostgreSQL le rendrait lent, dépendant du
 * réseau, et sensible à l'état laissé par le test précédent.
 *
 * Ce mock remplace `src/config/database.js`. Chaque test décide ce que
 * renvoie chaque méthode :
 *
 *   prismaMock.utilisateur.findUnique.mockResolvedValue({ ... });
 */
type ModeleMock = {
    findUnique: Mock;
    findFirst: Mock;
    findMany: Mock;
    create: Mock;
    update: Mock;
    updateMany: Mock;
    delete: Mock;
    deleteMany: Mock;
    count: Mock;
    upsert: Mock;
};
type PrismaMockShape = {
    utilisateur: ModeleMock;
    commande: ModeleMock;
    jetonReinitialisation: ModeleMock;
    panier: ModeleMock;
    elementPanier: ModeleMock;
    produit: ModeleMock;
    historiquePoints: ModeleMock;
    zoneLivraison: ModeleMock;
    $queryRaw: Mock;
    $connect: Mock;
    $disconnect: Mock;
    $transaction: Mock;
};
export declare function creerPrismaMock(): PrismaMockShape;
export type PrismaMock = ReturnType<typeof creerPrismaMock>;
export {};
//# sourceMappingURL=prismaMock.d.ts.map