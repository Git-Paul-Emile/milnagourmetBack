declare class DeliveryPersonService {
    getAllDeliveryPersons(): Promise<{
        id: string;
        nomComplet: string;
        phone: string;
        vehicle: string;
        active: boolean;
        createdAt: Date;
        commandes: {
            id: string;
            statut: string;
            montantTotal: number;
            creeLe: Date;
        }[];
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