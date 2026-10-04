import { vi } from 'vitest';
export function creerPrismaMock() {
    const modele = () => ({
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
        $transaction: vi.fn(async (arg) => {
            if (typeof arg === 'function') {
                return arg(mock);
            }
            return Promise.all(arg);
        }),
    };
    return mock;
}
//# sourceMappingURL=prismaMock.js.map