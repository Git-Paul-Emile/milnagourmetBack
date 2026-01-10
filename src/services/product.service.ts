import productRepository from '../repository/product.repository.js';
import type { Produit } from '@prisma/client';
import type { ProductCreate, ProductUpdate } from '../validator/product.schema.js';
import { ProductCreateSchema, ProductUpdateSchema } from '../validator/product.schema.js';

class ProductService {
  private productRepository = productRepository;

  async create(data: ProductCreate): Promise<any> {
    try {
      // Validation des données
      const validatedData = ProductCreateSchema.parse(data);

      const product = await productRepository.create(validatedData);
      console.log(`Produit créé avec succès: ${product.nom}`);

      // Transformer les données pour correspondre à l'interface front-end
      return this.transformProduct(product);
    } catch (error) {
      console.error('Erreur dans le service lors de la création du produit:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const products = await productRepository.findAll();
      console.log(`${products.length} produits récupérés`);

      // Transformer les données pour correspondre à l'interface front-end
      const transformedProducts = products.map(product => this.transformProduct(product));

      return transformedProducts;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des produits:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<any | null> {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        console.log(`Produit avec l'ID ${id} non trouvé`);
        return null;
      }
      console.log(`Produit trouvé: ${product.nom}`);
      return this.transformProduct(product);
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération du produit:', error);
      throw error;
    }
  }

  async update(id: number, data: ProductUpdate): Promise<any> {
    try {
      // Validation des données
      const validatedData = ProductUpdateSchema.parse(data);

      // Vérifier si le produit existe
      const existingProduct = await productRepository.findById(id);
      if (!existingProduct) {
        throw new Error('Produit non trouvé');
      }

      const product = await productRepository.update(id, validatedData);
      console.log(`Produit mis à jour avec succès: ${product.nom}`);

      // Transformer les données pour correspondre à l'interface front-end
      return this.transformProduct(product);
    } catch (error) {
      console.error('Erreur dans le service lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<any> {
    try {
      // Vérifier si le produit existe
      const existingProduct = await productRepository.findById(id);
      if (!existingProduct) {
        throw new Error('Produit non trouvé');
      }

      const product = await productRepository.delete(id);
      console.log(`Produit supprimé avec succès: ${product.nom}`);
      return this.transformProduct(product);
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression du produit:', error);
      throw error;
    }
  }

  private transformProduct(product: Produit & { categorieProduit?: { nom: string } | null }): any {
    // Utiliser le code de la catégorie en minuscules
    const categoryName = String(product.categorie).toLowerCase();

    return {
      id: product.id.toString(),
      name: product.nom,
      category: categoryName,
      categoryId: product.categorieId ? product.categorieId.toString() : undefined,
      price: product.prix,
      description: product.description || '',
      image: product.image || '',
      available: product.disponible
    };
  }
}

export default new ProductService();