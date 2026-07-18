import type { Request, Response, NextFunction } from 'express';
import type { CategorieProduit } from '@prisma/client';
import { ZodError } from 'zod';
import productService from '../services/product.service.js';
import { jsonResponse, AppError, buildPaginationMeta } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import type { ProductUpdate } from '../validator/product.schema.js';
import { productQuerySchema } from '../validator/query.schema.js';

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

  // Récupérer tous les produits (pagination/recherche/filtre/tri optionnels via query params)
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = productQuerySchema.parse(req.query);
      const { page, limit, search, sortBy, sortOrder } = query;

      let category: CategorieProduit | undefined;
      if (query.category) {
        const normalized = query.category.toUpperCase();
        const validCategories: CategorieProduit[] = ['CREMEUX', 'LIQUIDE', 'CREATION'];
        if (!validCategories.includes(normalized as CategorieProduit)) {
          throw new AppError('Catégorie invalide', StatusCodes.BAD_REQUEST);
        }
        category = normalized as CategorieProduit;
      }
      const disponible = query.disponible !== undefined ? query.disponible === 'true' : undefined;

      const { items: products, total } = await productService.findAll({
        page,
        limit,
        search,
        category,
        disponible,
        sortBy,
        sortOrder
      });

      const isPaginated = page !== undefined && limit !== undefined;

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: `${products.length} produit(s) trouvé(s)`,
          data: products,
          meta: isPaginated ? buildPaginationMeta(page, limit, total) : undefined
        })
      );
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST));
      } else {
        next(error);
      }
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
      const updateData: Partial<ProductUpdate> = {};
      
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