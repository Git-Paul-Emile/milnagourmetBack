import type { CategorieProduitItem } from '@prisma/client';
import type { ProductCategoryCreate, ProductCategoryUpdate } from '../validator/categorie.schema.js';
export interface CategorieDTO {
    id: number;
    name: string;
    description: string | null;
    active: boolean;
    createdAt: string;
}
declare class CategorieService {
    private categorieRepository;
    create(data: ProductCategoryCreate): Promise<CategorieDTO>;
    findAll(): Promise<CategorieDTO[]>;
    findById(id: number): Promise<CategorieProduitItem | null>;
    update(id: number, data: ProductCategoryUpdate): Promise<CategorieDTO>;
    delete(id: number): Promise<CategorieProduitItem>;
}
declare const _default: CategorieService;
export default _default;
//# sourceMappingURL=categorie.service.d.ts.map