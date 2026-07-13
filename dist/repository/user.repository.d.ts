import type { Utilisateur } from "@prisma/client";
import type { RegisterInput } from "../validator/auth.schema.js";
export type UtilisateurWithOrderSummary = Utilisateur & {
    commandes: {
        id: number;
        statut: string;
        montantTotal: number;
        creeLe: Date;
    }[];
};
export interface UserListOptions {
    page?: number;
    limit?: number;
    search?: string;
    blocked?: boolean;
    sortBy?: 'name' | 'orders' | 'date';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedUsers {
    items: UtilisateurWithOrderSummary[];
    total: number;
}
declare class UserRepository {
    create(data: RegisterInput): Promise<Utilisateur>;
    findAll(options?: UserListOptions): Promise<PaginatedUsers>;
    findByPhone(telephone: string): Promise<Utilisateur | null>;
    findById(id: string): Promise<Utilisateur | null>;
    update(id: string, data: Partial<Utilisateur>): Promise<Utilisateur>;
    incrementTokenVersion(id: string): Promise<Utilisateur>;
    delete(id: string): Promise<void>;
}
declare const _default: UserRepository;
export default _default;
//# sourceMappingURL=user.repository.d.ts.map