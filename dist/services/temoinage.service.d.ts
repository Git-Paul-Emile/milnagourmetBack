import type { Temoinage } from '@prisma/client';
export interface TemoignageDTO {
    id: number;
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar: string | null;
    date: string;
    active?: boolean;
}
declare class TemoinageService {
    private temoinageRepository;
    getAllTestimonials(includeInactive?: boolean): Promise<TemoignageDTO[]>;
    createTestimonial(data: {
        name: string;
        location: string;
        rating: number;
        comment: string;
        avatar?: string;
        active?: boolean;
    }): Promise<Temoinage>;
    updateTestimonial(id: number, data: Partial<{
        name: string;
        location: string;
        rating: number;
        comment: string;
        avatar?: string;
        active: boolean;
    }>): Promise<Temoinage>;
    deleteTestimonial(id: number): Promise<void>;
}
declare const _default: TemoinageService;
export default _default;
//# sourceMappingURL=temoinage.service.d.ts.map