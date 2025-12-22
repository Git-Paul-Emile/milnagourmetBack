import type { Cereale } from "@prisma/client";
import type { CerealeCreate, CerealeUpdate } from "../validator/creation.schema.js";
declare class CerealeRepository {
    create(data: CerealeCreate): Promise<Cereale>;
    findAll(): Promise<Cereale[]>;
    findById(id: number): Promise<Cereale | null>;
    update(id: number, data: CerealeUpdate): Promise<Cereale>;
    delete(id: number): Promise<Cereale>;
}
declare const _default: CerealeRepository;
export default _default;
//# sourceMappingURL=cereale.repository.d.ts.map