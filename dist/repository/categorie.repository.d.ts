import type { CategorieProduitItem } from "@prisma/client";
import type { ProductCategoryCreate, ProductCategoryUpdate } from "../validator/categorie.schema.js";
declare class CategorieRepository {
    create(data: ProductCategoryCreate): Promise<CategorieProduitItem>;
    findAll(): Promise<CategorieProduitItem[]>;
    findById(id: number): Promise<CategorieProduitItem | null>;
    update(id: number, data: ProductCategoryUpdate): Promise<CategorieProduitItem>;
    delete(id: number): Promise<CategorieProduitItem>;
}
declare const _default: CategorieRepository;
export default _default;
//# sourceMappingURL=categorie.repository.d.ts.map