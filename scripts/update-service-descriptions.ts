/**
 * Script ponctuel — à exécuter UNE FOIS depuis back/ :
 *   npx tsx scripts/update-service-descriptions.ts
 *
 * Met à jour les descriptions des services spéciaux existants et ajoute
 * les composants de la boîte pancake (Pancake, Crêpes, Madeleine) s'ils
 * n'existent pas déjà. Idempotent, ré-exécutable sans danger.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DESCRIPTIONS: Record<string, string> = {
  panier: 'Panier garni, composé ou à composer.',
  pancake: 'Boîte de pancakes maison (minimum 10 pièces).',
};

const PANCAKE_COMPOSANTS = ['Pancake', 'Crêpes', 'Madeleine'];

async function main() {
  for (const [code, description] of Object.entries(DESCRIPTIONS)) {
    const service = await prisma.serviceSpecial.findUnique({ where: { code } });
    if (!service) {
      console.warn(`⚠️  Service introuvable : ${code}`);
      continue;
    }

    await prisma.serviceSpecial.update({ where: { code }, data: { description } });
    console.log(`✅ Description mise à jour pour « ${service.nom} »`);

    if (service.produitId) {
      await prisma.produit.update({ where: { id: service.produitId }, data: { description } });
      console.log(`   ✅ Description du produit lié mise à jour`);
    }

    if (code === 'pancake') {
      for (const nom of PANCAKE_COMPOSANTS) {
        const exists = await prisma.composantService.findFirst({ where: { serviceId: service.id, nom } });
        if (!exists) {
          await prisma.composantService.create({ data: { serviceId: service.id, nom } });
          console.log(`      ➕ Composant : ${nom}`);
        }
      }
    }
  }

  console.log('\n🎉 Terminé.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
