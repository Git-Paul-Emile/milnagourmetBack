declare class CatalogService {
    getCatalogSectionData(): Promise<{
        title: string;
        description: string;
        creationTitle: string;
        creationDescription: string;
        creationButtonText: string;
        creationImage: string | null;
        emptyMessage: string;
        emptySubMessage: string;
    }>;
    updateCatalogSectionData(data: {
        title?: string;
        description?: string;
        creationTitle?: string;
        creationDescription?: string;
        creationButtonText?: string;
        creationImage?: string;
        emptyMessage?: string;
        emptySubMessage?: string;
    }): Promise<{
        title: string;
        description: string;
        creationTitle: string;
        creationDescription: string;
        creationButtonText: string;
        creationImage: string | null;
        emptyMessage: string;
        emptySubMessage: string;
    }>;
}
declare const _default: CatalogService;
export default _default;
//# sourceMappingURL=catalog.service.d.ts.map