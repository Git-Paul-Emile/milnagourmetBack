import type { HoraireOuverture } from '@prisma/client';
declare class ContactService {
    private contactRepository;
    getContactInfo(): Promise<{
        companyName: string;
        address: string;
        phone: string;
        email: string;
        whatsapp: string;
        hours: any;
    }>;
    getSocialMedia(): Promise<any>;
    getContactSectionData(): Promise<{
        socialLinks: {
            name: string;
            handle: string;
            url: string;
        }[];
        address: string;
        storeHours: {
            day: string;
            hours: string;
        }[];
        title: string;
        description: string;
        methods: ({
            title: string;
            description: string;
            action: string;
            primary: boolean;
        } | {
            title: string;
            description: string;
            action: string;
            primary?: undefined;
        })[];
    }>;
    private groupSimilarHours;
    updateContactInfo(data: {
        companyName?: string;
        address?: string;
        phone?: string;
        email?: string;
        whatsapp?: string;
        hours?: any;
    }): Promise<{
        id: number;
        modifieLe: Date;
        nomEntreprise: string;
        adresse: string;
        telephone: string;
        email: string;
        whatsapp: string;
    } & {
        horaires: HoraireOuverture[];
    }>;
    updateSocialMedia(socialMedia: Array<{
        plateforme: string;
        url: string;
        active: boolean;
    }>): Promise<{
        active: boolean;
        id: number;
        modifieLe: Date;
        plateforme: string;
        url: string;
    }[]>;
    private convertHoursToDB;
}
declare const _default: ContactService;
export default _default;
//# sourceMappingURL=contact.service.d.ts.map