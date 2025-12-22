import { PrismaClient } from '@prisma/client';
import { productsData } from './data/products.js';
export async function seedProducts(prisma) {
    console.log('🧀 Création des produits...');
    const productIdMap = {};
    for (const product of productsData) {
        const categoryMap = {
            'cremeux': 1,
            'liquide': 2,
            'creation': 3
        };
        const productId = parseInt(product.id.split('-')[1] || '0') || Math.floor(Math.random() * 1000);
        const createdProduct = await prisma.produit.upsert({
            where: { id: productId },
            update: {},
            create: {
                nom: product.name,
                categorie: product.category.toUpperCase(),
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
//# sourceMappingURL=products.seed.js.map