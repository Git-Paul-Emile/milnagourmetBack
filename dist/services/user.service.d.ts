declare class UserService {
    getAllUsers(): Promise<{
        id: string;
        name: string;
        phone: string;
        deliveryZoneId: string;
        role: "user" | "admin" | "delivery";
        blocked: boolean;
        createdAt: Date;
        orders: any;
    }[]>;
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