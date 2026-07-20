declare class SpecialServiceRepository {
    findAll(): Promise<({
        produit: {
            nom: string;
            description: string | null;
            id: number;
            creeLe: Date;
            modifieLe: Date;
            image: string | null;
            disponible: boolean;
            prix: number;
            categorie: import("@prisma/client").$Enums.CategorieProduit;
            categorieId: number | null;
        } | null;
        composants: {
            nom: string;
            id: number;
            creeLe: Date;
            modifieLe: Date;
            disponible: boolean;
            serviceId: number;
        }[];
    } & {
        nom: string;
        description: string | null;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        image: string | null;
        code: string;
        produitId: number | null;
        actif: boolean;
        minElements: number;
    })[]>;
    findActive(): Promise<({
        produit: {
            nom: string;
            description: string | null;
            id: number;
            creeLe: Date;
            modifieLe: Date;
            image: string | null;
            disponible: boolean;
            prix: number;
            categorie: import("@prisma/client").$Enums.CategorieProduit;
            categorieId: number | null;
        } | null;
        composants: {
            nom: string;
            id: number;
            creeLe: Date;
            modifieLe: Date;
            disponible: boolean;
            serviceId: number;
        }[];
    } & {
        nom: string;
        description: string | null;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        image: string | null;
        code: string;
        produitId: number | null;
        actif: boolean;
        minElements: number;
    })[]>;
    findById(id: number): Promise<({
        produit: {
            nom: string;
            description: string | null;
            id: number;
            creeLe: Date;
            modifieLe: Date;
            image: string | null;
            disponible: boolean;
            prix: number;
            categorie: import("@prisma/client").$Enums.CategorieProduit;
            categorieId: number | null;
        } | null;
        composants: {
            nom: string;
            id: number;
            creeLe: Date;
            modifieLe: Date;
            disponible: boolean;
            serviceId: number;
        }[];
    } & {
        nom: string;
        description: string | null;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        image: string | null;
        code: string;
        produitId: number | null;
        actif: boolean;
        minElements: number;
    }) | null>;
    update(id: number, data: {
        nom?: string;
        description?: string;
        image?: string;
        actif?: boolean;
        minElements?: number;
    }): Promise<{
        produit: {
            nom: string;
            description: string | null;
            id: number;
            creeLe: Date;
            modifieLe: Date;
            image: string | null;
            disponible: boolean;
            prix: number;
            categorie: import("@prisma/client").$Enums.CategorieProduit;
            categorieId: number | null;
        } | null;
        composants: {
            nom: string;
            id: number;
            creeLe: Date;
            modifieLe: Date;
            disponible: boolean;
            serviceId: number;
        }[];
    } & {
        nom: string;
        description: string | null;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        image: string | null;
        code: string;
        produitId: number | null;
        actif: boolean;
        minElements: number;
    }>;
    createComposant(serviceId: number, nom: string): Promise<{
        nom: string;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        disponible: boolean;
        serviceId: number;
    }>;
    updateComposant(id: number, data: {
        nom?: string;
        disponible?: boolean;
    }): Promise<{
        nom: string;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        disponible: boolean;
        serviceId: number;
    }>;
    deleteComposant(id: number): Promise<{
        nom: string;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        disponible: boolean;
        serviceId: number;
    }>;
}
declare const _default: SpecialServiceRepository;
export default _default;
//# sourceMappingURL=specialService.repository.d.ts.map