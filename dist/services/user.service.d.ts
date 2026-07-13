import type { UserListOptions } from '../repository/user.repository.js';
export interface UserDTO {
    id: string;
    name: string;
    phone: string;
    deliveryZoneId: string;
    role: 'user' | 'admin' | 'delivery';
    blocked: boolean;
    createdAt: Date;
    orders: {
        id: string;
        status: 'RECU' | 'LIVREE' | 'ANNULEE';
        total: number;
        date: string;
        items: never[];
        notes: string;
        customer: null;
    }[];
}
declare class UserService {
    getAllUsers(options?: UserListOptions): Promise<{
        items: UserDTO[];
        total: number;
    }>;
    private transformUser;
    updateUser(id: string, data: Partial<{
        blocked: boolean;
        deliveryZoneId: string;
    }>): Promise<{
        id: string;
        name: string;
        phone: string;
        deliveryZoneId: string;
        role: "user" | "admin" | "delivery";
        blocked: boolean;
        createdAt: Date;
    }>;
    deleteUser(id: string): Promise<void>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map