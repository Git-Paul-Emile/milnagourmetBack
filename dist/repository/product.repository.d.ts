import type { Produit, CategorieProduit } from "@prisma/client";
import type { ProductCreate, ProductUpdate } from "../validator/product.schema.js";
export interface ProductListOptions {
    page?: number;
    limit?: number;
    search?: string;
    category?: CategorieProduit;
    disponible?: boolean;
    sortBy?: 'name' | 'price' | 'date';
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedProducts {
    items: Produit[];
    total: number;
}
declare class ProductRepository {
    create(data: ProductCreate): Promise<Produit>;
    findAll(options?: ProductListOptions): Promise<PaginatedProducts>;
    findById(id: number): Promise<Produit | null>;
    update(id: number, data: ProductUpdate): Promise<Produit>;
    delete(id: number): Promise<Produit>;
}
declare const _default: ProductRepository;
export default _default;
//# sourceMappingURL=product.repository.d.ts.map