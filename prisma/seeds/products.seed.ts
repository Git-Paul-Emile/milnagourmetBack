import { PrismaClient } from '@prisma/client';
import { productsData } from './data/products.js';

export async function seedProducts(prisma: PrismaClient, onlyProductIds?: string[]) {
  console.log('🧀 Création des produits...');

  const productIdMap: { [key: string]: number } = {};
  const selectedProducts = onlyProductIds
    ? productsData.filter(product => onlyProductIds.includes(product.id))
    : productsData;

  if (onlyProductIds && selectedProducts.length !== new Set(onlyProductIds).size) {
    throw new Error('Un ou plusieurs produits demandés ne sont pas présents dans les données de seed.');
  }

  for (const product of selectedProducts) {
    if (onlyProductIds && product.id === 'liquide-bissap') {
      const existingProduct = await prisma.produit.findFirst({
        where: { nom: product.name }
      });

      if (!existingProduct) {
        throw new Error(`Produit introuvable pour la mise à jour ciblée : ${product.name}`);
      }

      const updatedProduct = await prisma.produit.update({
        where: { id: existingProduct.id },
        data: { description: product.description }
      });
      productIdMap[product.id] = updatedProduct.id;
      continue;
    }

    const categoryMap: { [key: string]: number } = {
      'cremeux': 1,
      'liquide': 2,
      'creation': 3
    };

    const productId = parseInt(product.id.split('-')[1] || '0') || Math.floor(Math.random() * 1000);
    const createdProduct = await prisma.produit.upsert({
      where: { id: productId },
      update: product.id === 'liquide-bissap' ? { description: product.description } : {},
      create: {
        nom: product.name,
        categorie: product.category.toUpperCase() as any,
        categorieId: categoryMap[product.category],
        prix: product.price,
        description: product.description,
        image: product.image,
        disponible: product.available !== false
      }
    });

    productIdMap[product.id] = createdProduct.id;
  }


  return productIdMap;
}