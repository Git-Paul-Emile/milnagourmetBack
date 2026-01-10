import type { Utilisateur } from '@prisma/client';
import type { LoginInput, UpdateProfileInput } from '../validator/auth.schema.js';
declare class AuthService {
    private userRepository;
    register(data: any): Promise<{
        user: Utilisateur;
        accessToken: string;
        refreshToken: string;
    }>;
    login(data: LoginInput): Promise<{
        user: Utilisateur;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logoutAll(userId: string): Promise<void>;
    findById(id: string): Promise<Utilisateur | null>;
    updateProfile(id: string, updateData: UpdateProfileInput): Promise<Utilisateur>;
    deleteAccount(userId: string): Promise<void>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map