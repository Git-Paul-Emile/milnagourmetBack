declare class SpecialServiceService {
    getAll(): Promise<{
        id: number;
        code: string;
        name: string;
        description: string | null;
        image: string | null;
        active: boolean;
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
            available: boolean;
        }[];
    }[]>;
    getActive(): Promise<{
        id: number;
        code: string;
        name: string;
        description: string | null;
        image: string | null;
        active: boolean;
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
            available: boolean;
        }[];
    }[]>;
    update(id: number, data: {
        nom?: string;
        description?: string;
        image?: string;
        actif?: boolean;
        minElements?: number;
    }): Promise<{
        id: number;
        code: string;
        name: string;
        description: string | null;
        image: string | null;
        active: boolean;
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
            available: boolean;
        }[];
    }>;
    addComposant(serviceId: number, nom: string): Promise<{
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
declare const _default: SpecialServiceService;
export default _default;
//# sourceMappingURL=specialService.service.d.ts.map