import type { Livreur } from "@prisma/client";
declare class DeliveryPersonRepository {
    findAll(): Promise<(Livreur & {
        commandes: {
            id: number;
            statut: string;
            montantTotal: number;
            creeLe: Date;
        }[];
    })[]>;
    findById(id: string): Promise<(Livreur & {
        commandes: any[];
    }) | null>;
    create(data: {
        nomComplet: string;
        telephone: string;
        vehicule: string;
    }): Promise<Livreur>;
    update(id: string, data: Partial<Livreur>): Promise<Livreur>;
    delete(id: string): Promise<void>;
}
declare const _default: DeliveryPersonRepository;
export default _default;
//# sourceMappingURL=deliveryPerson.repository.d.ts.map