import type { Fruit } from "@prisma/client";
import type { FruitCreate, FruitUpdate } from "../validator/creation.schema.js";
declare class FruitRepository {
    create(data: FruitCreate): Promise<Fruit>;
    findAll(): Promise<Fruit[]>;
    findById(id: number): Promise<Fruit | null>;
    update(id: number, data: FruitUpdate): Promise<Fruit>;
    delete(id: number): Promise<Fruit>;
}
declare const _default: FruitRepository;
export default _default;
//# sourceMappingURL=fruit.repository.d.ts.map