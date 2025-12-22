import type { ProductCreate, ProductUpdate } from '../validator/product.schema.js';
declare class ProductService {
    private productRepository;
    create(data: ProductCreate): Promise<any>;
    findAll(): Promise<any[]>;
    findById(id: number): Promise<any | null>;
    update(id: number, data: ProductUpdate): Promise<any>;
    delete(id: number): Promise<any>;
    private transformProduct;
}
declare const _default: ProductService;
export default _default;
//# sourceMappingURL=product.service.d.ts.map