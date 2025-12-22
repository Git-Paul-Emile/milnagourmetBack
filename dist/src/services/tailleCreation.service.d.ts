import type { TailleCreation } from '@prisma/client';
import type { TailleCreationCreate, TailleCreationUpdate } from '../validator/creation.schema.js';
declare class TailleCreationService {
    private tailleCreationRepository;
    create(data: TailleCreationCreate): Promise<TailleCreation>;
    findAll(): Promise<TailleCreation[]>;
    findById(id: number): Promise<TailleCreation | null>;
    update(id: number, data: TailleCreationUpdate): Promise<TailleCreation>;
    delete(id: number): Promise<TailleCreation>;
}
declare const _default: TailleCreationService;
export default _default;
//# sourceMappingURL=tailleCreation.service.d.ts.map