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
            image: string | null;
            disponible: boolean;
            parDefaut: boolean;
            quantiteDefaut: number;
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
        typeService: string;
        prixBase: number;
        covers: string[];
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
            image: string | null;
            disponible: boolean;
            parDefaut: boolean;
            quantiteDefaut: number;
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
        typeService: string;
        prixBase: number;
        covers: string[];
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
            image: string | null;
            disponible: boolean;
            parDefaut: boolean;
            quantiteDefaut: number;
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
        typeService: string;
        prixBase: number;
        covers: string[];
        minElements: number;
    }) | null>;
    update(id: number, data: {
        nom?: string;
        description?: string;
        image?: string;
        actif?: boolean;
        minElements?: number;
        prixBase?: number;
        typeService?: string;
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
            image: string | null;
            disponible: boolean;
            parDefaut: boolean;
            quantiteDefaut: number;
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
        typeService: string;
        prixBase: number;
        covers: string[];
        minElements: number;
    }>;
    createComposant(serviceId: number, nom: string): Promise<{
        nom: string;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        image: string | null;
        disponible: boolean;
        parDefaut: boolean;
        quantiteDefaut: number;
        serviceId: number;
    }>;
    updateComposant(id: number, data: {
        nom?: string;
        image?: string;
        disponible?: boolean;
        parDefaut?: boolean;
        quantiteDefaut?: number;
    }): Promise<{
        nom: string;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        image: string | null;
        disponible: boolean;
        parDefaut: boolean;
        quantiteDefaut: number;
        serviceId: number;
    }>;
    deleteComposant(id: number): Promise<{
        nom: string;
        id: number;
        creeLe: Date;
        modifieLe: Date;
        image: string | null;
        disponible: boolean;
        parDefaut: boolean;
        quantiteDefaut: number;
        serviceId: number;
    }>;
}
declare const _default: SpecialServiceRepository;
export default _default;
//# sourceMappingURL=specialService.repository.d.ts.map