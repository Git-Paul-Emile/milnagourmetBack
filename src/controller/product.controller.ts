import type { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service.js';
import { jsonResponse, AppError } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';

class ProductController {
  private productService = productService;

  // Créer un nouveau produit
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);

      res.status(StatusCodes.CREATED).json(
        jsonResponse({
          status: 'success',
          message: 'Produit créé avec succès',
          data: product
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer tous les produits
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.findAll();

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: `${products.length} produit(s) trouvé(s)`,
          data: products
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer un produit par ID
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id!);
      if (isNaN(id)) {
        throw new AppError('ID de produit invalide', StatusCodes.BAD_REQUEST);
      }

      const product = await productService.findById(id);
      if (!product) {
        throw new AppError('Produit non trouvé', StatusCodes.NOT_FOUND);
      }

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Produit trouvé',
          data: product
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour un produit
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id!);
      if (isNaN(id)) {
        throw new AppError('ID de produit invalide', StatusCodes.BAD_REQUEST);
      }

      // Parser le FormData (les champs texte sont dans req.body, les fichiers dans req.files)
      const updateData: any = {};
      
      if (req.body.nom) updateData.nom = req.body.nom;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.prix) updateData.prix = parseInt(req.body.prix, 10);
      if (req.body.categorie) updateData.categorie = req.body.categorie;
      if (req.body.categorieId) updateData.categorieId = parseInt(req.body.categorieId, 10);
      if (req.body.image !== undefined) updateData.image = req.body.image;
      if (req.body.disponible !== undefined) {
        updateData.disponible = req.body.disponible === 'true' || req.body.disponible === true;
      }

      const product = await productService.update(id, updateData);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Produit mis à jour avec succès',
          data: product
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un produit
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id!);
      if (isNaN(id)) {
        throw new AppError('ID de produit invalide', StatusCodes.BAD_REQUEST);
      }

      const product = await productService.delete(id);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Produit supprimé avec succès',
          data: product
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();