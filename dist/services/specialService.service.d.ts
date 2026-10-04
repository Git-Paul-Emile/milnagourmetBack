declare class SpecialServiceService {
    getAll(): Promise<{
        id: number;
        code: string;
        name: string;
        description: string | null;
        image: string | null;
        active: boolean;
        serviceType: string;
        basePrice: number;
        covers: string[];
        minElements: number;
        linkedProduct: {
            id: number;
            name: string;
            price: number;
            category: string;
            available: boolean;
        } | null;
        components: {
            id: number;
            name: string;
            image: string | null;
            available: boolean;
            isDefault: boolean;
            defaultQuantity: number;
        }[];
    }[]>;
    getActive(): Promise<{
        id: number;
        code: string;
        name: string;
        description: string | null;
        image: string | null;
        active: boolean;
        serviceType: string;
        basePrice: number;
        covers: string[];
        minElements: number;
        linkedProduct: {
            id: number;
            name: string;
            price: number;
            category: string;
            available: boolean;
        } | null;
        components: {
            id: number;
            name: string;
            image: string | null;
            available: boolean;
            isDefault: boolean;
            defaultQuantity: number;
        }[];
    }[]>;
    update(id: number, data: {
        nom?: string;
        description?: string;
        image?: string;
        actif?: boolean;
        minElements?: number;
        prixBase?: number;
        typeService?: string;
    }): Promise<{
        id: number;
        code: string;
        name: string;
        description: string | null;
        image: string | null;
        active: boolean;
        serviceType: string;
        basePrice: number;
        covers: string[];
        minElements: number;
        linkedProduct: {
            id: number;
            name: string;
            price: number;
            category: string;
            available: boolean;
        } | null;
        components: {
            id: number;
            name: string;
            image: string | null;
            available: boolean;
            isDefault: boolean;
            defaultQuantity: number;
        }[];
    }>;
    addComposant(serviceId: number, nom: string): Promise<{
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
declare const _default: SpecialServiceService;
export default _default;
//# sourceMappingURL=specialService.service.d.ts.map