import { prisma } from "../config/database.js"
import type { Contact, HoraireOuverture, ReseauSocial } from "@prisma/client"

class ContactRepository {

    async findContact(): Promise<Contact & { horaires: HoraireOuverture[] } | null> {
        try {
            const contact = await prisma.contact.findFirst({
                include: {
                    horaires: {
                        orderBy: { ordre: 'asc' }
                    }
                }
            });
            return contact;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de contact:', error);
            throw new Error('Impossible de récupérer les informations de contact');
        }
    }

    async updateContact(data: Partial<Omit<Contact, 'id' | 'modifieLe'>>): Promise<Contact & { horaires: HoraireOuverture[] }> {
        try {
            // Récupérer le contact existant ou en créer un nouveau
            let contact = await this.findContact();

            if (!contact) {
                contact = await prisma.contact.create({
                    data: {
                        nomEntreprise: data.nomEntreprise || '',
                        adresse: data.adresse || '',
                        telephone: data.telephone || '',
                        email: data.email || '',
                        whatsapp: data.whatsapp || ''
                    },
                    include: {
                        horaires: {
                            orderBy: { ordre: 'asc' }
                        }
                    }
                });
            } else {
                contact = await prisma.contact.update({
                    where: { id: contact.id },
                    data,
                    include: {
                        horaires: {
                            orderBy: { ordre: 'asc' }
                        }
                    }
                });
            }

            return contact!;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations de contact:', error);
            throw new Error('Impossible de mettre à jour les informations de contact');
        }
    }

    async updateHoraires(contactId: number, horaires: Array<{ jour: string; ouverture?: string; fermeture?: string; ferme: boolean; ordre: number }>): Promise<HoraireOuverture[]> {
        try {
            // Supprimer les horaires existants
            await prisma.horaireOuverture.deleteMany({
                where: { contactId }
            });

            // Créer les nouveaux horaires
            const horairesData = horaires.map(horaire => ({
                ...horaire,
                contactId
            }));

            const result = await prisma.horaireOuverture.createMany({
                data: horairesData
            });

            // Récupérer les horaires créés
            const createdHoraires = await prisma.horaireOuverture.findMany({
                where: { contactId },
                orderBy: { ordre: 'asc' }
            });

            return createdHoraires;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des horaires:', error);
            throw new Error('Impossible de mettre à jour les horaires');
        }
    }

    async findAllSocialMedia(): Promise<ReseauSocial[]> {
        try {
            const socialMedia = await prisma.reseauSocial.findMany({
                where: { active: true },
                orderBy: { plateforme: 'asc' }
            });
            return socialMedia;
        } catch (error) {
            console.error('Erreur lors de la récupération des réseaux sociaux:', error);
            throw new Error('Impossible de récupérer les réseaux sociaux');
        }
    }

    async updateSocialMedia(data: Array<{ plateforme: string; url: string; active: boolean }>): Promise<ReseauSocial[]> {
        try {
            // Supprimer tous les réseaux sociaux existants
            await prisma.reseauSocial.deleteMany();

            // Créer les nouveaux réseaux sociaux
            const socialMediaData = data.map(social => ({
                plateforme: social.plateforme,
                url: social.url,
                active: social.active
            }));

            await prisma.reseauSocial.createMany({
                data: socialMediaData
            });

            // Récupérer les réseaux sociaux créés
            const createdSocialMedia = await this.findAllSocialMedia();
            return createdSocialMedia;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des réseaux sociaux:', error);
            throw new Error('Impossible de mettre à jour les réseaux sociaux');
        }
    }
}

export default new ContactRepository();