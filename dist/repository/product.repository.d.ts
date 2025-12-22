import type { Produit } from "@prisma/client";
import type { ProductCreate, ProductUpdate } from "../validator/product.schema.js";
declare class ProductRepository {
    create(data: ProductCreate): Promise<Produit>;
    findAll(): Promise<Produit[]>;
    findById(id: number): Promise<Produit | null>;
    update(id: number, data: ProductUpdate): Promise<Produit>;
    delete(id: number): Promise<Produit>;
}
declare const _default: ProductRepository;
export default _default;
//# sourceMappingURL=product.repository.d.ts.map