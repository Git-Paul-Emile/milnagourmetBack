import { PrismaClient } from '@prisma/client';
export declare function seedContact(prisma: PrismaClient): Promise<{
    id: number;
    modifieLe: Date;
    nomEntreprise: string;
    adresse: string;
    telephone: string;
    email: string;
    whatsapp: string;
}>;
//# sourceMappingURL=contact.seed.d.ts.map