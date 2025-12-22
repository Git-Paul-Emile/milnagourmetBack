declare class DeliveryZoneService {
    getAllDeliveryZones(): Promise<{
        id: string;
        name: string;
        deliveryFee: number;
        estimatedTime: string;
        active: boolean;
    }[]>;
    getAllActive(): Promise<{
        id: string;
        name: string;
        deliveryFee: number;
        estimatedTime: string;
        active: boolean;
    }[]>;
    getAllDeliveryZonesWithOrderCounts(): Promise<{
        id: string;
        name: string;
        deliveryFee: number;
        estimatedTime: string;
        active: boolean;
        orderCount: number;
        totalRevenue: number;
    }[]>;
    getDeliveryZoneById(id: number): Promise<{
        id: string;
        name: string;
        deliveryFee: number;
        estimatedTime: string;
        active: boolean;
    }>;
    createDeliveryZone(data: {
        name: string;
        deliveryFee: number;
        estimatedTime: string;
        active?: boolean;
    }): Promise<{
        id: string;
        name: string;
        deliveryFee: number;
        estimatedTime: string;
        active: boolean;
    }>;
    updateDeliveryZone(id: number, data: {
        name?: string;
        deliveryFee?: number;
        estimatedTime?: string;
        active?: boolean;
    }): Promise<{
        id: string;
        name: string;
        deliveryFee: number;
        estimatedTime: string;
        active: boolean;
    }>;
    deleteDeliveryZone(id: number): Promise<{
        success: boolean;
    }>;
}
declare const _default: DeliveryZoneService;
export default _default;
//# sourceMappingURL=deliveryZone.service.d.ts.map