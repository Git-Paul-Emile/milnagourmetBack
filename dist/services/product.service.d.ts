import type { ProductListOptions } from '../repository/product.repository.js';
import type { ProductCreate, ProductUpdate } from '../validator/product.schema.js';
export interface ProductDTO {
    id: string;
    name: string;
    category: string;
    categoryId?: string;
    price: number;
    description: string;
    image: string;
    available: boolean;
}
declare class ProductService {
    private productRepository;
    create(data: ProductCreate): Promise<ProductDTO>;
    findAll(options?: ProductListOptions): Promise<{
        items: ProductDTO[];
        total: number;
    }>;
    findById(id: number): Promise<ProductDTO | null>;
    update(id: number, data: ProductUpdate): Promise<ProductDTO>;
    delete(id: number): Promise<ProductDTO>;
    private transformProduct;
}
declare const _default: ProductService;
export default _default;
//# sourceMappingURL=product.service.d.ts.map