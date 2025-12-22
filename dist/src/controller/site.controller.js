import { StatusCodes } from 'http-status-codes';
import { jsonResponse } from '../utils/index.js';
import contactService from '../services/contact.service.js';
import temoinageService from '../services/temoinage.service.js';
import brandingService from '../services/branding.service.js';
import heroService from '../services/hero.service.js';
import catalogService from '../services/catalog.service.js';
import navigationService from '../services/navigation.service.js';
class SiteController {
    // Récupérer les informations de branding
    async getBranding(req, res, next) {
        try {
            const branding = await brandingService.getBranding();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Branding récupéré avec succès',
                data: branding
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour les informations de branding
    async updateBranding(req, res, next) {
        try {
            const { logo } = req.body;
            if (!logo) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Le logo est requis'
                }));
            }
            const branding = await brandingService.updateBranding(logo);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Branding mis à jour avec succès',
                data: branding
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les informations de contact
    async getContact(req, res, next) {
        try {
            const contact = await contactService.getContactInfo();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Informations de contact récupérées avec succès',
                data: contact
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour les informations de contact
    async updateContact(req, res, next) {
        try {
            const { companyName, address, phone, email, whatsapp } = req.body;
            const contact = await contactService.updateContactInfo({
                companyName,
                address,
                phone,
                email,
                whatsapp
            });
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Informations de contact mises à jour avec succès',
                data: {
                    companyName: contact.nomEntreprise,
                    address: contact.adresse,
                    phone: contact.telephone,
                    email: contact.email,
                    whatsapp: contact.whatsapp
                }
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les réseaux sociaux
    async getSocialMedia(req, res, next) {
        try {
            const socialMedia = await contactService.getSocialMedia();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Réseaux sociaux récupérés avec succès',
                data: socialMedia
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour les réseaux sociaux
    async updateSocialMedia(req, res, next) {
        try {
            const socialMedia = req.body;
            if (!Array.isArray(socialMedia)) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Les réseaux sociaux doivent être un tableau'
                }));
            }
            const result = await contactService.updateSocialMedia(socialMedia);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Réseaux sociaux mis à jour avec succès',
                data: result
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les témoignages actifs (pour le frontend public)
    async getTestimonials(req, res, next) {
        try {
            const testimonials = await temoinageService.getAllTestimonials();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Témoignages récupérés avec succès',
                data: testimonials
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer tous les témoignages (pour l'admin)
    async getAllTestimonials(req, res, next) {
        try {
            const testimonials = await temoinageService.getAllTestimonials(true);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Tous les témoignages récupérés avec succès',
                data: testimonials
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Créer un témoignage
    async createTestimonial(req, res, next) {
        try {
            const { name, location, rating, comment, avatar } = req.body;
            if (!name || !location || !rating || !comment) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Tous les champs requis doivent être fournis'
                }));
            }
            // Vérifier la longueur du commentaire (max 200 caractères pour ~4 lignes)
            if (comment.length > 200) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Le commentaire ne doit pas dépasser 200 caractères'
                }));
            }
            const testimonial = await temoinageService.createTestimonial({
                name,
                location,
                rating: parseInt(rating),
                comment,
                avatar
            });
            res.status(StatusCodes.CREATED).json(jsonResponse({
                status: 'success',
                message: 'Témoignage créé avec succès',
                data: testimonial
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour un témoignage (pour activation/désactivation par admin)
    async updateTestimonial(req, res, next) {
        try {
            const { id } = req.params;
            const { active, name, location, rating, comment, avatar } = req.body;
            if (!id) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'ID de témoignage manquant'
                }));
            }
            const testimonialId = parseInt(id);
            if (isNaN(testimonialId)) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'ID de témoignage invalide'
                }));
            }
            // Vérifier la longueur du commentaire si fourni
            if (comment && comment.length > 200) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Le commentaire ne doit pas dépasser 200 caractères'
                }));
            }
            const testimonial = await temoinageService.updateTestimonial(testimonialId, {
                active,
                name,
                location,
                rating,
                comment,
                avatar
            });
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Témoignage mis à jour avec succès',
                data: testimonial
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Supprimer un témoignage (refuser)
    async deleteTestimonial(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'ID de témoignage manquant'
                }));
            }
            const testimonialId = parseInt(id);
            if (isNaN(testimonialId)) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'ID de témoignage invalide'
                }));
            }
            await temoinageService.deleteTestimonial(testimonialId);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Témoignage supprimé avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les données de la section Hero
    async getHero(req, res, next) {
        try {
            const heroData = await heroService.getHeroData();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Données Hero récupérées avec succès',
                data: heroData
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour les données de la section Hero
    async updateHero(req, res, next) {
        try {
            const { title, subtitle, badge, banner } = req.body;
            const heroData = await heroService.updateHeroData({
                title,
                subtitle,
                badge,
                banner
            });
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Données Hero mises à jour avec succès',
                data: heroData
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les données de la section Contact
    async getContactSection(req, res, next) {
        try {
            const contactSectionData = await contactService.getContactSectionData();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Données Contact récupérées avec succès',
                data: contactSectionData
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les données de la section Catalogue
    async getCatalogSection(req, res, next) {
        try {
            const catalogData = await catalogService.getCatalogSectionData();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Données Catalogue récupérées avec succès',
                data: catalogData
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour les données de la section Catalogue
    async updateCatalogSection(req, res, next) {
        try {
            const { title, description, creationTitle, creationDescription, creationButtonText, creationImage, emptyMessage, emptySubMessage } = req.body;
            const catalogData = await catalogService.updateCatalogSectionData({
                title,
                description,
                creationTitle,
                creationDescription,
                creationButtonText,
                creationImage,
                emptyMessage,
                emptySubMessage
            });
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Données Catalogue mises à jour avec succès',
                data: catalogData
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer la navigation du header
    async getNavigation(req, res, next) {
        try {
            const navigation = await navigationService.getNavigation();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Navigation récupérée avec succès',
                data: navigation
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les horaires d'ouverture
    async getStoreHours(req, res, next) {
        try {
            const contactInfo = await contactService.getContactInfo();
            // Convertir le format des horaires pour le frontend
            const storeHours = [];
            for (const [dayKey, dayData] of Object.entries(contactInfo.hours)) {
                const dayMap = {
                    'monday': 'Lundi',
                    'tuesday': 'Mardi',
                    'wednesday': 'Mercredi',
                    'thursday': 'Jeudi',
                    'friday': 'Vendredi',
                    'saturday': 'Samedi',
                    'sunday': 'Dimanche'
                };
                const dayName = dayMap[dayKey] || dayKey;
                const hourData = dayData;
                // Garantir que open/close sont au format HH:MM (ou '00:00' en cas de fermeture)
                const openValue = hourData.closed ? '00:00' : (hourData.open || '00:00');
                const closeValue = hourData.closed ? '00:00' : (hourData.close || '00:00');
                storeHours.push({
                    day: dayName,
                    open: openValue,
                    close: closeValue,
                    closed: !!hourData.closed
                });
            }
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Horaires d\'ouverture récupérés avec succès',
                data: storeHours
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour les horaires d'ouverture
    async updateStoreHours(req, res, next) {
        try {
            const { hours } = req.body;
            if (!hours || !Array.isArray(hours)) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Les horaires sont requis et doivent être un tableau'
                }));
            }
            // Convertir le format du frontend vers le format attendu par le service
            const hoursMap = {};
            const dayMap = {
                'Lundi': 'monday',
                'Mardi': 'tuesday',
                'Mercredi': 'wednesday',
                'Jeudi': 'thursday',
                'Vendredi': 'friday',
                'Samedi': 'saturday',
                'Dimanche': 'sunday'
            };
            hours.forEach((hour) => {
                const dayKey = dayMap[hour.day] || hour.day.toLowerCase();
                hoursMap[dayKey] = {
                    open: hour.open,
                    close: hour.close,
                    closed: hour.closed
                };
            });
            // Mettre à jour les horaires via le service
            await contactService.updateContactInfo({ hours: hoursMap });
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Horaires d\'ouverture mis à jour avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new SiteController();
//# sourceMappingURL=site.controller.js.map