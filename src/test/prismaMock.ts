import { vi, type Mock } from 'vitest';

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

export function creerPrismaMock(): PrismaMockShape {
  const modele = (): ModeleMock => ({
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    upsert: vi.fn(),
  });

  const mock = {
    utilisateur: modele(),
    commande: modele(),
    jetonReinitialisation: modele(),
    panier: modele(),
    elementPanier: modele(),
    produit: modele(),
    historiquePoints: modele(),
    zoneLivraison: modele(),
    $queryRaw: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    /**
     * `$transaction` a deux formes dans Prisma, toutes deux utilisées
     * dans ce projet :
     *   - tableau d'opérations : `prisma.$transaction([op1, op2])`
     *   - fonction de rappel   : `prisma.$transaction(async (tx) => …)`
     *
     * Dans la forme fonction, `tx` doit exposer les mêmes modèles que le
     * client : on lui repasse donc le mock lui-même. Sans cela,
     * `tx.utilisateur` vaudrait `undefined` et le test échouerait pour
     * une raison sans rapport avec le code testé.
     */
    $transaction: vi.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: unknown) => Promise<unknown>)(mock);
      }
      return Promise.all(arg as Promise<unknown>[]);
    }),
  };

  return mock;
}

export type PrismaMock = ReturnType<typeof creerPrismaMock>;
