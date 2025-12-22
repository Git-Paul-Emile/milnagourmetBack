import { PrismaClient } from '@prisma/client';
export async function seedCategories(prisma) {
    console.log('📦 Création des catégories de produits...');
    const categories = [
        { id: 1, nom: 'Crèmeux', description: 'Yaourts crémeux et onctueux', active: true },
        { id: 2, nom: 'Liquide', description: 'Yaourts liquides rafraîchissants', active: true }
    ];
    for (const category of categories) {
        await prisma.categorieProduitItem.upsert({
            where: { id: category.id },
            update: { active: true },
            create: category
        });
    }
}
//# sourceMappingURL=categories.seed.js.map