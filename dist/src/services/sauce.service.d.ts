import type { Sauce } from '@prisma/client';
import type { SauceCreate, SauceUpdate } from '../validator/creation.schema.js';
declare class SauceService {
    private sauceRepository;
    create(data: SauceCreate): Promise<Sauce>;
    findAll(): Promise<Sauce[]>;
    findById(id: number): Promise<Sauce | null>;
    update(id: number, data: SauceUpdate): Promise<Sauce>;
    delete(id: number): Promise<Sauce>;
}
declare const _default: SauceService;
export default _default;
//# sourceMappingURL=sauce.service.d.ts.map