declare class HeroService {
    getHeroData(): Promise<{
        title: string;
        subtitle: string;
        badge: string;
        banner: string | null;
        features: {
            title: any;
            description: any;
        }[];
    }>;
    updateHeroData(data: {
        title?: string;
        subtitle?: string;
        badge?: string;
        banner?: string;
    }): Promise<{
        title: string;
        subtitle: string;
        badge: string;
        banner: string | null;
        features: {
            title: any;
            description: any;
        }[];
    }>;
}
declare const _default: HeroService;
export default _default;
//# sourceMappingURL=hero.service.d.ts.map