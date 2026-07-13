import type { Commande, ElementCommande, CreationPersonnalisee, Utilisateur, Livreur, Produit, TailleCreation, StatutCommande } from "@prisma/client";
export interface OrderListOptions {
    page?: number;
    limit?: number;
    search?: string;
    status?: StatutCommande;
    sortBy?: 'date' | 'total' | 'status';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedOrders {
    items: CommandeWithRelations[];
    total: number;
}
export type CommandeWithRelations = Commande & {
    utilisateur: Utilisateur | null;
    elements: (ElementCommande & {
        produit: Produit;
    })[];
    creationsPersonnalisees: (CreationPersonnalisee & {
        taille: TailleCreation;
        fruits: {
            fruit: {
                nom: string;
            };
        }[];
        sauces: {
            sauce: {
                nom: string;
            };
        }[];
        cereales: {
            cereale: {
                nom: string;
            };
        }[];
    })[];
    livreur: Livreur | null;
};
interface CreateOrderData {
    numeroCommande: string;
    utilisateurId?: number;
    nomClient: string;
    telephoneClient: string;
    montantTotal: number;
    fraisLivraison?: number;
    notes?: string;
    livreurId?: number;
    elements: {
        produitId: number;
        quantite: number;
        prix: number;
    }[];
    creations?: {
        tailleId: number;
        quantite: number;
        prix: number;
        fruits?: {
            fruitId: number;
        }[];
        sauces?: {
            sauceId: number;
        }[];
        cereales?: {
            cerealeId: number;
        }[];
    }[];
}
declare class OrderRepository {
    create(data: CreateOrderData): Promise<CommandeWithRelations>;
    findAll(options?: OrderListOptions): Promise<PaginatedOrders>;
    findById(id: number): Promise<CommandeWithRelations | null>;
    findByUserId(utilisateurId: number): Promise<CommandeWithRelations[]>;
    updateStatus(id: number, statut: StatutCommande): Promise<CommandeWithRelations>;
    assignDeliveryPerson(id: number, livreurId: number | null): Promise<CommandeWithRelations>;
}
declare const _default: OrderRepository;
export default _default;
//# sourceMappingURL=order.repository.d.ts.map