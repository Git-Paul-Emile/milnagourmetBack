declare class DeliveryPersonService {
    getAllDeliveryPersons(): Promise<{
        id: any;
        nomComplet: any;
        phone: any;
        vehicle: any;
        active: any;
        createdAt: any;
        commandes: any;
    }[]>;
    getDeliveryPersonById(id: string): Promise<{
        id: string;
        nomComplet: string;
        phone: string;
        vehicle: string;
        active: boolean;
        createdAt: Date;
    }>;
    createDeliveryPerson(data: {
        nomComplet: string;
        phone: string;
        vehicle: string;
    }): Promise<{
        id: string;
        nomComplet: string;
        phone: string;
        vehicle: string;
        active: boolean;
        createdAt: Date;
    }>;
    updateDeliveryPerson(id: string, data: {
        nomComplet?: string;
        phone?: string;
        vehicle?: string;
        active?: boolean;
    }): Promise<{
        id: string;
        nomComplet: string;
        phone: string;
        vehicle: string;
        active: boolean;
        createdAt: Date;
    }>;
    deleteDeliveryPerson(id: string): Promise<{
        success: boolean;
    }>;
}
declare const _default: DeliveryPersonService;
export default _default;
//# sourceMappingURL=deliveryPerson.service.d.ts.map