import type { Temoinage } from "@prisma/client";
declare class TemoinageRepository {
    findAllActive(): Promise<Temoinage[]>;
    findAll(): Promise<Temoinage[]>;
    create(data: Omit<Temoinage, 'id'>): Promise<Temoinage>;
    update(id: number, data: Partial<Omit<Temoinage, 'id'>>): Promise<Temoinage>;
    delete(id: number): Promise<void>;
}
declare const _default: TemoinageRepository;
export default _default;
//# sourceMappingURL=temoinage.repository.d.ts.map