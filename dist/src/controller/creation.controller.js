import fruitService from '../services/fruit.service.js';
import sauceService from '../services/sauce.service.js';
import cerealeService from '../services/cereale.service.js';
import tailleCreationService from '../services/tailleCreation.service.js';
import { jsonResponse, AppError } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
class CreationController {
    fruitService = fruitService;
    sauceService = sauceService;
    cerealeService = cerealeService;
    tailleCreationService = tailleCreationService;
    // ==================== FRUITS ====================
    async getFruits(req, res, next) {
        try {
            const fruits = await fruitService.findAll();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: `${fruits.length} fruit(s) trouvé(s)`,
                data: fruits
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async getFruitById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de fruit invalide', StatusCodes.BAD_REQUEST);
            }
            const fruit = await fruitService.findById(id);
            if (!fruit) {
                throw new AppError('Fruit non trouvé', StatusCodes.NOT_FOUND);
            }
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Fruit trouvé',
                data: fruit
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async createFruit(req, res, next) {
        try {
            const fruit = await fruitService.create(req.body);
            res.status(StatusCodes.CREATED).json(jsonResponse({
                status: 'success',
                message: 'Fruit créé avec succès',
                data: fruit
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async updateFruit(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de fruit invalide', StatusCodes.BAD_REQUEST);
            }
            const fruit = await fruitService.update(id, req.body);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Fruit mis à jour avec succès',
                data: fruit
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteFruit(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de fruit invalide', StatusCodes.BAD_REQUEST);
            }
            const fruit = await fruitService.delete(id);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Fruit supprimé avec succès',
                data: fruit
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // ==================== SAUCES ====================
    async getSauces(req, res, next) {
        try {
            const sauces = await sauceService.findAll();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: `${sauces.length} sauce(s) trouvée(s)`,
                data: sauces
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async getSauceById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de sauce invalide', StatusCodes.BAD_REQUEST);
            }
            const sauce = await sauceService.findById(id);
            if (!sauce) {
                throw new AppError('Sauce non trouvée', StatusCodes.NOT_FOUND);
            }
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Sauce trouvée',
                data: sauce
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async createSauce(req, res, next) {
        try {
            const sauce = await sauceService.create(req.body);
            res.status(StatusCodes.CREATED).json(jsonResponse({
                status: 'success',
                message: 'Sauce créée avec succès',
                data: sauce
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async updateSauce(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de sauce invalide', StatusCodes.BAD_REQUEST);
            }
            const sauce = await sauceService.update(id, req.body);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Sauce mise à jour avec succès',
                data: sauce
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteSauce(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de sauce invalide', StatusCodes.BAD_REQUEST);
            }
            const sauce = await sauceService.delete(id);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Sauce supprimée avec succès',
                data: sauce
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // ==================== CÉRÉALES ====================
    async getCereales(req, res, next) {
        try {
            const cereales = await cerealeService.findAll();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: `${cereales.length} céréale(s) trouvée(s)`,
                data: cereales
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async getCerealeById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de céréale invalide', StatusCodes.BAD_REQUEST);
            }
            const cereale = await cerealeService.findById(id);
            if (!cereale) {
                throw new AppError('Céréale non trouvée', StatusCodes.NOT_FOUND);
            }
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Céréale trouvée',
                data: cereale
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async createCereale(req, res, next) {
        try {
            const cereale = await cerealeService.create(req.body);
            res.status(StatusCodes.CREATED).json(jsonResponse({
                status: 'success',
                message: 'Céréale créée avec succès',
                data: cereale
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async updateCereale(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de céréale invalide', StatusCodes.BAD_REQUEST);
            }
            const cereale = await cerealeService.update(id, req.body);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Céréale mise à jour avec succès',
                data: cereale
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteCereale(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de céréale invalide', StatusCodes.BAD_REQUEST);
            }
            const cereale = await cerealeService.delete(id);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Céréale supprimée avec succès',
                data: cereale
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // ==================== TAILLES ====================
    async getTailles(req, res, next) {
        try {
            const tailles = await tailleCreationService.findAll();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: `${tailles.length} taille(s) trouvée(s)`,
                data: tailles
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async getTailleById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de taille invalide', StatusCodes.BAD_REQUEST);
            }
            const taille = await tailleCreationService.findById(id);
            if (!taille) {
                throw new AppError('Taille non trouvée', StatusCodes.NOT_FOUND);
            }
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Taille trouvée',
                data: taille
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async createTaille(req, res, next) {
        try {
            const taille = await tailleCreationService.create(req.body);
            res.status(StatusCodes.CREATED).json(jsonResponse({
                status: 'success',
                message: 'Taille créée avec succès',
                data: taille
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async updateTaille(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de taille invalide', StatusCodes.BAD_REQUEST);
            }
            const taille = await tailleCreationService.update(id, req.body);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Taille mise à jour avec succès',
                data: taille
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteTaille(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new AppError('ID de taille invalide', StatusCodes.BAD_REQUEST);
            }
            const taille = await tailleCreationService.delete(id);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Taille supprimée avec succès',
                data: taille
            }));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new CreationController();
//# sourceMappingURL=creation.controller.js.map