import contactRepository from '../repository/contact.repository.js';
class ContactService {
    contactRepository = contactRepository;
    async getContactInfo() {
        try {
            const contact = await this.contactRepository.findContact();
            if (!contact) {
                // Retourner des données vides si aucun contact n'existe
                return {
                    companyName: '',
                    address: '',
                    phone: '',
                    email: '',
                    whatsapp: '',
                    hours: {}
                };
            }
            // Convertir les horaires du format DB vers le format API
            const hours = {};
            const dayMap = {
                'Lundi': 'monday',
                'Mardi': 'tuesday',
                'Mercredi': 'wednesday',
                'Jeudi': 'thursday',
                'Vendredi': 'friday',
                'Samedi': 'saturday',
                'Dimanche': 'sunday'
            };
            contact.horaires.forEach((horaire) => {
                const dayKey = dayMap[horaire.jour] || horaire.jour.toLowerCase();
                hours[dayKey] = {
                    open: horaire.ouverture || '',
                    close: horaire.fermeture || '',
                    closed: horaire.ferme
                };
            });
            return {
                companyName: contact.nomEntreprise,
                address: contact.adresse,
                phone: contact.telephone,
                email: contact.email,
                whatsapp: contact.whatsapp,
                hours
            };
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération des informations de contact:', error);
            throw error;
        }
    }
    async getSocialMedia() {
        try {
            const socialMedia = await this.contactRepository.findAllSocialMedia();
            // Convertir vers le format attendu par l'API
            const result = {};
            socialMedia.forEach(social => {
                const platform = social.plateforme.toLowerCase();
                result[platform] = social.url;
            });
            return result;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération des réseaux sociaux:', error);
            throw error;
        }
    }
    async getContactSectionData() {
        try {
            const contact = await this.contactRepository.findContact();
            const socialMedia = await this.contactRepository.findAllSocialMedia();
            // Valeurs de base (sans données hard-codées)
            const baseData = {
                title: "Contactez-Nous",
                description: "Nous sommes là pour répondre à vos questions et prendre vos commandes. N'hésitez pas à nous contacter !",
                methods: [
                    {
                        title: 'WhatsApp',
                        description: 'Commandez directement',
                        action: 'whatsapp',
                        primary: true
                    },
                    {
                        title: 'Appeler',
                        description: 'Support téléphonique',
                        action: 'call'
                    }
                ],
                socialLinks: [],
                address: '',
                storeHours: []
            };
            // Convertir les réseaux sociaux depuis la base de données
            const socialLinks = socialMedia.map(social => ({
                name: social.plateforme,
                handle: `@milnagourmet`,
                url: social.url
            }));
            let address = '';
            let storeHours = [];
            if (contact) {
                address = contact.adresse;
                // Convertir les horaires pour l'affichage
                const rawStoreHours = [];
                contact.horaires
                    .filter((h) => !h.ferme && h.jour)
                    .forEach((h) => {
                    rawStoreHours.push({
                        day: h.jour,
                        hours: h.ouverture && h.fermeture ? `${h.ouverture} - ${h.fermeture}` : 'Fermé'
                    });
                });
                // Grouper les jours similaires
                storeHours = this.groupSimilarHours(rawStoreHours);
            }
            return {
                ...baseData,
                socialLinks,
                address,
                storeHours
            };
        }
        catch (error) {
            console.error('Erreur dans le service lors de la récupération des données de contact:', error);
            throw error;
        }
    }
    groupSimilarHours(hours) {
        // Grouper les jours avec les mêmes horaires
        const hourGroups = {};
        hours.forEach(hour => {
            const key = hour.hours;
            if (!hourGroups[key]) {
                hourGroups[key] = [];
            }
            if (hour.day) {
                hourGroups[key].push(hour.day);
            }
        });
        const result = [];
        for (const [hourRange, days] of Object.entries(hourGroups)) {
            if (days.length === 1 && days[0]) {
                result.push({ day: days[0], hours: hourRange });
            }
            else if (days.length > 1 && days[0] && days[days.length - 1]) {
                result.push({ day: `${days[0]} - ${days[days.length - 1]}`, hours: hourRange });
            }
        }
        // Ajouter dimanche fermé s'il n'y a pas d'horaires pour dimanche
        const hasSunday = result.some(h => h.day && h.day.includes('Dimanche'));
        if (!hasSunday) {
            result.push({ day: 'Dimanche', hours: 'Fermé' });
        }
        return result;
    }
    async updateContactInfo(data) {
        try {
            // Convertir les horaires du format API vers le format DB
            const horaires = data.hours ? this.convertHoursToDB(data.hours) : [];
            // Mettre à jour le contact
            const contact = await this.contactRepository.updateContact({
                nomEntreprise: data.companyName,
                adresse: data.address,
                telephone: data.phone,
                email: data.email,
                whatsapp: data.whatsapp
            });
            // Mettre à jour les horaires si fournis
            if (horaires.length > 0) {
                await this.contactRepository.updateHoraires(contact.id, horaires);
            }
            return contact;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour des informations de contact:', error);
            throw error;
        }
    }
    async updateSocialMedia(socialMedia) {
        try {
            const result = await this.contactRepository.updateSocialMedia(socialMedia);
            return result;
        }
        catch (error) {
            console.error('Erreur dans le service lors de la mise à jour des réseaux sociaux:', error);
            throw error;
        }
    }
    convertHoursToDB(hours) {
        const dayMap = {
            'monday': 'Lundi',
            'tuesday': 'Mardi',
            'wednesday': 'Mercredi',
            'thursday': 'Jeudi',
            'friday': 'Vendredi',
            'saturday': 'Samedi',
            'sunday': 'Dimanche'
        };
        const horaires = [];
        let ordre = 0;
        for (const [key, value] of Object.entries(hours)) {
            const day = dayMap[key] || key;
            const hourData = value;
            horaires.push({
                jour: day,
                ouverture: hourData.closed ? undefined : hourData.open,
                fermeture: hourData.closed ? undefined : hourData.close,
                ferme: hourData.closed,
                ordre: ordre++
            });
        }
        return horaires;
    }
}
export default new ContactService();
//# sourceMappingURL=contact.service.js.map