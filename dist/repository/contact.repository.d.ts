import type { Contact, HoraireOuverture, ReseauSocial } from "@prisma/client";
declare class ContactRepository {
    findContact(): Promise<Contact & {
        horaires: HoraireOuverture[];
    } | null>;
    updateContact(data: Partial<Omit<Contact, 'id' | 'modifieLe'>>): Promise<Contact & {
        horaires: HoraireOuverture[];
    }>;
    updateHoraires(contactId: number, horaires: Array<{
        jour: string;
        ouverture?: string;
        fermeture?: string;
        ferme: boolean;
        ordre: number;
    }>): Promise<HoraireOuverture[]>;
    findAllSocialMedia(): Promise<ReseauSocial[]>;
    updateSocialMedia(data: Array<{
        plateforme: string;
        url: string;
        active: boolean;
    }>): Promise<ReseauSocial[]>;
}
declare const _default: ContactRepository;
export default _default;
//# sourceMappingURL=contact.repository.d.ts.map