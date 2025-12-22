import { PrismaClient } from '@prisma/client';
export declare function seedDelivery(prisma: PrismaClient): Promise<{
    zoneIdMap: {
        [key: string]: number;
    };
    livreurIdMap: {
        [key: string]: number;
    };
}>;
//# sourceMappingURL=delivery.seed.d.ts.map