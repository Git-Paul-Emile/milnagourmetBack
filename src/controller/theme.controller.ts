import type { Request, Response } from 'express';
import themeService from '../services/theme.service.js';
import { AppError } from '../utils/AppError.js';
import { jsonResponse } from '../utils/response.js';

export class ThemeController {
  async getAllThemes(req: Request, res: Response) {
    try {
      const themes = await themeService.getAllThemes();
      res.json(jsonResponse({
        status: 'success',
        message: 'Thèmes récupérés avec succès',
        data: themes
      }));
    } catch (error) {
      console.error('Erreur dans getAllThemes:', error);
      res.status(500).json(jsonResponse({
        status: 'error',
        message: 'Erreur serveur'
      }));
    }
  }

  async getActiveTheme(req: Request, res: Response) {
    try {
      const theme = await themeService.getActiveTheme();
      if (!theme) {
        return res.status(404).json(jsonResponse({
          status: 'not_found',
          message: 'Aucun thème trouvé'
        }));
      }
      res.json(jsonResponse({
        status: 'success',
        message: 'Thème actif récupéré avec succès',
        data: theme
      }));
    } catch (error) {
      console.error('Erreur dans getActiveTheme:', error);
      res.status(500).json(jsonResponse({
        status: 'error',
        message: 'Erreur serveur'
      }));
    }
  }

  async getThemeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème manquant'
        }));
      }

      const themeId = parseInt(id);

      if (isNaN(themeId)) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème invalide'
        }));
      }

      const theme = await themeService.getThemeById(themeId);
      res.json(jsonResponse({
        status: 'success',
        message: 'Thème récupéré avec succès',
        data: theme
      }));
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json(jsonResponse({
          status: 'error',
          message: error.message
        }));
      }
      console.error('Erreur dans getThemeById:', error);
      res.status(500).json(jsonResponse({
        status: 'error',
        message: 'Erreur serveur'
      }));
    }
  }

  async createTheme(req: Request, res: Response) {
    try {
      const { name, description, lightColors, darkColors } = req.body;

      if (!name || !lightColors) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'Le nom et les couleurs du mode clair sont requis'
        }));
      }

      const theme = await themeService.createTheme({
        name,
        description,
        lightColors,
        darkColors
      });

      res.status(201).json(jsonResponse({
        status: 'success',
        message: 'Thème créé avec succès',
        data: theme
      }));
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json(jsonResponse({
          status: 'error',
          message: error.message
        }));
      }
      console.error('Erreur dans createTheme:', error);
      res.status(500).json(jsonResponse({
        status: 'error',
        message: 'Erreur serveur'
      }));
    }
  }

  async updateTheme(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème manquant'
        }));
      }

      const themeId = parseInt(id);

      if (isNaN(themeId)) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème invalide'
        }));
      }

      const { name, description, lightColors, darkColors } = req.body;

      const theme = await themeService.updateTheme(themeId, {
        name,
        description,
        lightColors,
        darkColors
      });

      res.json(jsonResponse({
        status: 'success',
        message: 'Thème mis à jour avec succès',
        data: theme
      }));
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json(jsonResponse({
          status: 'error',
          message: error.message
        }));
      }
      console.error('Erreur dans updateTheme:', error);
      res.status(500).json(jsonResponse({
        status: 'error',
        message: 'Erreur serveur'
      }));
    }
  }

  async setActiveTheme(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème manquant'
        }));
      }

      const themeId = parseInt(id);

      if (isNaN(themeId)) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème invalide'
        }));
      }

      const theme = await themeService.setActiveTheme(themeId);
      res.json(jsonResponse({
        status: 'success',
        message: 'Thème activé avec succès',
        data: { message: 'Thème activé avec succès', theme }
      }));
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json(jsonResponse({
          status: 'error',
          message: error.message
        }));
      }
      console.error('Erreur dans setActiveTheme:', error);
      res.status(500).json(jsonResponse({
        status: 'error',
        message: 'Erreur serveur'
      }));
    }
  }

  async setDefaultTheme(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème manquant'
        }));
      }

      const themeId = parseInt(id);

      if (isNaN(themeId)) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème invalide'
        }));
      }

      const theme = await themeService.setDefaultTheme(themeId);
      res.json(jsonResponse({
        status: 'success',
        message: 'Thème défini comme défaut avec succès',
        data: { message: 'Thème défini comme défaut avec succès', theme }
      }));
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json(jsonResponse({
          status: 'error',
          message: error.message
        }));
      }
      console.error('Erreur dans setDefaultTheme:', error);
      res.status(500).json(jsonResponse({
        status: 'error',
        message: 'Erreur serveur'
      }));
    }
  }

  async deleteTheme(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème manquant'
        }));
      }

      const themeId = parseInt(id);

      if (isNaN(themeId)) {
        return res.status(400).json(jsonResponse({
          status: 'fail',
          message: 'ID de thème invalide'
        }));
      }

      const result = await themeService.deleteTheme(themeId);
      res.json(jsonResponse({
        status: 'success',
        message: 'Thème supprimé avec succès',
        data: result
      }));
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json(jsonResponse({
          status: 'error',
          message: error.message
        }));
      }
      console.error('Erreur dans deleteTheme:', error);
      res.status(500).json(jsonResponse({
        status: 'error',
        message: 'Erreur serveur'
      }));
    }
  }
}

export default new ThemeController();