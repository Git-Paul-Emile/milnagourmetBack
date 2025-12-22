import type { Sauce } from "@prisma/client";
import type { SauceCreate, SauceUpdate } from "../validator/creation.schema.js";
declare class SauceRepository {
    create(data: SauceCreate): Promise<Sauce>;
    findAll(): Promise<Sauce[]>;
    findById(id: number): Promise<Sauce | null>;
    update(id: number, data: SauceUpdate): Promise<Sauce>;
    delete(id: number): Promise<Sauce>;
}
declare const _default: SauceRepository;
export default _default;
//# sourceMappingURL=sauce.repository.d.ts.map