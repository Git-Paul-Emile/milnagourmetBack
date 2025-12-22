import type { Utilisateur } from "@prisma/client";
import type { RegisterInput } from "../validator/auth.schema.js";
declare class UserRepository {
    create(data: RegisterInput): Promise<Utilisateur>;
    findAll(): Promise<Utilisateur[]>;
    findByPhone(telephone: string): Promise<Utilisateur | null>;
    findById(id: string): Promise<Utilisateur | null>;
    update(id: string, data: Partial<Utilisateur>): Promise<Utilisateur>;
    incrementTokenVersion(id: string): Promise<Utilisateur>;
    delete(id: string): Promise<void>;
}
declare const _default: UserRepository;
export default _default;
//# sourceMappingURL=user.repository.d.ts.map