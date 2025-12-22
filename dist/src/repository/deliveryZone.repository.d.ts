declare class DeliveryZoneRepository {
    findAll(): Promise<{
        nom: string;
        active: boolean;
        id: number;
        creeLe: Date;
        fraisLivraison: number;
        tempsEstime: string;
    }[]>;
    findById(id: number): Promise<{
        nom: string;
        active: boolean;
        id: number;
        creeLe: Date;
        fraisLivraison: number;
        tempsEstime: string;
    } | null>;
    create(data: {
        nom: string;
        fraisLivraison: number;
        tempsEstime: string;
        active?: boolean;
    }): Promise<{
        nom: string;
        active: boolean;
        id: number;
        creeLe: Date;
        fraisLivraison: number;
        tempsEstime: string;
    }>;
    update(id: number, data: {
        nom?: string;
        fraisLivraison?: number;
        tempsEstime?: string;
        active?: boolean;
    }): Promise<{
        nom: string;
        active: boolean;
        id: number;
        creeLe: Date;
        fraisLivraison: number;
        tempsEstime: string;
    }>;
    delete(id: number): Promise<{
        nom: string;
        active: boolean;
        id: number;
        creeLe: Date;
        fraisLivraison: number;
        tempsEstime: string;
    }>;
    findAllActive(): Promise<{
        nom: string;
        active: boolean;
        id: number;
        creeLe: Date;
        fraisLivraison: number;
        tempsEstime: string;
    }[]>;
    findAllWithOrderCounts(): Promise<{
        id: number;
        nom: string;
        fraisLivraison: number;
        tempsEstime: string;
        active: boolean;
        creeLe: Date;
        orderCount: bigint;
        totalRevenue: bigint;
    }[]>;
}
declare const _default: DeliveryZoneRepository;
export default _default;
//# sourceMappingURL=deliveryZone.repository.d.ts.map