declare class AProposService {
    getAboutData(): Promise<{
        title: string;
        description: string;
        values: {
            title: string;
            description: string;
            icon: string;
        }[];
        missions: {
            title: string;
            description: string;
            icon: any;
        }[];
        stats: {
            satisfiedCustomers: number;
            uniqueFlavors: number;
            yearsExperience: number;
        };
    }>;
}
declare const _default: AProposService;
export default _default;
//# sourceMappingURL=aPropos.service.d.ts.map