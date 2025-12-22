import { StatusCodes } from 'http-status-codes';
import { jsonResponse } from '../utils/index.js';
import { AppError } from '../utils/AppError.js';
import userService from '../services/user.service.js';
class UserController {
    // Récupérer tous les utilisateurs
    async getAll(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Utilisateurs récupérés avec succès',
                data: users
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Mettre à jour un utilisateur (bloquer / débloquer / zone)
    async update(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError('ID utilisateur requis', StatusCodes.BAD_REQUEST);
            }
            const updatedUser = await userService.updateUser(id, req.body);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Utilisateur mis à jour avec succès',
                data: updatedUser
            }));
        }
        catch (error) {
            next(error);
        }
    }
    // Supprimer un utilisateur
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError('ID utilisateur requis', StatusCodes.BAD_REQUEST);
            }
            await userService.deleteUser(id);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Utilisateur supprimé avec succès',
                data: null
            }));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new UserController();
//# sourceMappingURL=user.controller.js.map