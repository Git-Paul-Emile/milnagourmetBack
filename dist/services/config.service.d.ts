declare class ConfigService {
    getOrderStatusConfig(): Promise<{
        id: number;
        creeLe: Date;
        modifieLe: Date;
        ordre: number;
        statut: import("@prisma/client").$Enums.StatutCommande;
        libelleFr: string;
        couleurBg: string;
        couleurText: string;
        icone: string | null;
    }[] | {
        id: number;
        statut: string;
        libelleFr: string;
        couleurBg: string;
        couleurText: string;
        icone: string;
        ordre: number;
        creeLe: Date;
        modifieLe: Date;
    }[]>;
    getCategoryTranslations(): Promise<({
        categorie: {
            nom: string;
            description: string | null;
            active: boolean;
            id: number;
            creeLe: Date;
            modifieLe: Date;
        };
    } & {
        id: number;
        creeLe: Date;
        modifieLe: Date;
        categorieId: number;
        code: string;
        libelleFr: string;
    })[]>;
    getSizeTranslations(): Promise<({
        taille: {
            nom: string;
            active: boolean;
            id: number;
            ordreAffichage: number;
            prix: number;
            maxFruits: number;
            maxSauces: number;
            cerealesAutorise: boolean;
        };
    } & {
        id: number;
        creeLe: Date;
        modifieLe: Date;
        tailleId: number;
        code: string;
        libelleFr: string;
    })[] | {
        id: number;
        tailleId: number;
        code: string;
        libelleFr: string;
        creeLe: Date;
        modifieLe: Date;
        taille: {
            id: number;
            nom: string;
            prix: number;
            maxFruits: number;
            maxSauces: number;
            cerealesAutorise: boolean;
            active: boolean;
            ordreAffichage: number;
            creeLe: Date;
            modifieLe: Date;
        };
    }[]>;
    getAllConfig(): Promise<{
        orderStatuses: {
            id: number;
            creeLe: Date;
            modifieLe: Date;
            ordre: number;
            statut: import("@prisma/client").$Enums.StatutCommande;
            libelleFr: string;
            couleurBg: string;
            couleurText: string;
            icone: string | null;
        }[] | {
            id: number;
            statut: string;
            libelleFr: string;
            couleurBg: string;
            couleurText: string;
            icone: string;
            ordre: number;
            creeLe: Date;
            modifieLe: Date;
        }[];
        categoryTranslations: ({
            categorie: {
                nom: string;
                description: string | null;
                active: boolean;
                id: number;
                creeLe: Date;
                modifieLe: Date;
            };
        } & {
            id: number;
            creeLe: Date;
            modifieLe: Date;
            categorieId: number;
            code: string;
            libelleFr: string;
        })[];
        sizeTranslations: ({
            taille: {
                nom: string;
                active: boolean;
                id: number;
                ordreAffichage: number;
                prix: number;
                maxFruits: number;
                maxSauces: number;
                cerealesAutorise: boolean;
            };
        } & {
            id: number;
            creeLe: Date;
            modifieLe: Date;
            tailleId: number;
            code: string;
            libelleFr: string;
        })[] | {
            id: number;
            tailleId: number;
            code: string;
            libelleFr: string;
            creeLe: Date;
            modifieLe: Date;
            taille: {
                id: number;
                nom: string;
                prix: number;
                maxFruits: number;
                maxSauces: number;
                cerealesAutorise: boolean;
                active: boolean;
                ordreAffichage: number;
                creeLe: Date;
                modifieLe: Date;
            };
        }[];
    }>;
}
declare const _default: ConfigService;
export default _default;
//# sourceMappingURL=config.service.d.ts.map