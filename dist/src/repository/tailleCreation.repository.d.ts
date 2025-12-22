import type { TailleCreation } from "@prisma/client";
import type { TailleCreationCreate, TailleCreationUpdate } from "../validator/creation.schema.js";
declare class TailleCreationRepository {
    create(data: TailleCreationCreate): Promise<TailleCreation>;
    findAll(): Promise<TailleCreation[]>;
    findById(id: number): Promise<TailleCreation | null>;
    update(id: number, data: TailleCreationUpdate): Promise<TailleCreation>;
    delete(id: number): Promise<TailleCreation>;
}
declare const _default: TailleCreationRepository;
export default _default;
//# sourceMappingURL=tailleCreation.repository.d.ts.map