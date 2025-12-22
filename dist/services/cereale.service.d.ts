import type { Cereale } from '@prisma/client';
import type { CerealeCreate, CerealeUpdate } from '../validator/creation.schema.js';
declare class CerealeService {
    private cerealeRepository;
    create(data: CerealeCreate): Promise<Cereale>;
    findAll(): Promise<Cereale[]>;
    findById(id: number): Promise<Cereale | null>;
    update(id: number, data: CerealeUpdate): Promise<Cereale>;
    delete(id: number): Promise<Cereale>;
}
declare const _default: CerealeService;
export default _default;
//# sourceMappingURL=cereale.service.d.ts.map