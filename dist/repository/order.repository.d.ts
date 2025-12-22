import type { Commande, ElementCommande, CreationPersonnalisee, Livreur, Produit } from "@prisma/client";
export type CommandeWithRelations = Commande & {
    utilisateur: any;
    elements: (ElementCommande & {
        produit: Produit;
    })[];
    creationsPersonnalisees: (CreationPersonnalisee & {
        taille: any;
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
    findAll(): Promise<CommandeWithRelations[]>;
    findById(id: number): Promise<CommandeWithRelations | null>;
    findByUserId(utilisateurId: number): Promise<CommandeWithRelations[]>;
    updateStatus(id: number, statut: string): Promise<CommandeWithRelations>;
}
declare const _default: OrderRepository;
export default _default;
//# sourceMappingURL=order.repository.d.ts.map