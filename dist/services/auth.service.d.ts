import type { Utilisateur } from '@prisma/client';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../validator/auth.schema.js';
declare class AuthService {
    private userRepository;
    /**
     * Inscription d'un nouvel utilisateur.
     *
     * ATTENTION — VALIDATION UNIQUE
     * Les données arrivent DÉJÀ validées et transformées par le middleware
     * `validateResource(registerSchema)` monté sur la route. Il ne faut
     * surtout pas revalider ici : `zoneLivraisonId` a été converti de
     * `string` en `number` par le schéma, et une seconde passe échouerait
     * systématiquement avec « expected string, received number » — c'est
     * exactement le bug que ce commentaire prévient.
     *
     * Règle générale : un schéma qui transforme ses données ne peut pas
     * être appliqué deux fois. La validation appartient à la frontière
     * HTTP, pas au service.
     */
    register(data: RegisterInput): Promise<{
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