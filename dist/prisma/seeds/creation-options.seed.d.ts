import { PrismaClient } from '@prisma/client';
export declare function seedCreationOptions(prisma: PrismaClient): Promise<{
    tailleIdMap: {
        [key: string]: number;
    };
    fruitIdMap: {
        [key: string]: number;
    };
    sauceIdMap: {
        [key: string]: number;
    };
    cerealeIdMap: {
        [key: string]: number;
    };
}>;
//# sourceMappingURL=creation-options.seed.d.ts.map