import { PrismaClient } from '@prisma/client';
export declare function seedOrders(prisma: PrismaClient, userIdMap: {
    [key: string]: number;
}, productIdMap: {
    [key: string]: number;
}, tailleIdMap: {
    [key: string]: number;
}, fruitIdMap: {
    [key: string]: number;
}, sauceIdMap: {
    [key: string]: number;
}, cerealeIdMap: {
    [key: string]: number;
}, zoneIdMap: {
    [key: string]: number;
}, livreurIdMap: {
    [key: string]: number;
}): Promise<void>;
//# sourceMappingURL=orders.seed.d.ts.map