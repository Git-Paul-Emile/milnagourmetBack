import { PrismaClient } from '@prisma/client';
import { defaultThemeData, eventThemesData } from './data/theme.js';

const prisma = new PrismaClient();

export async function seedThemes() {
  try {
    console.log('🌈 Seeding themes...');

    // Créer le thème par défaut s'il n'existe pas
    const existingDefaultTheme = await prisma.theme.findFirst({
      where: { isDefault: true }
    });

    if (!existingDefaultTheme) {
      await prisma.theme.create({
        data: defaultThemeData
      });
      console.log('✅ Thème par défaut "Milna Classique" créé');
    } else {
      console.log('ℹ️ Thème par défaut déjà existant');
    }

    // Créer ou mettre à jour les thèmes événementiels
    for (const eventTheme of eventThemesData) {
      await prisma.theme.upsert({
        where: { name: eventTheme.name },
        update: eventTheme,
        create: eventTheme
      });
      console.log(`✅ Thème "${eventTheme.name}" créé ou mis à jour`);
    }

    console.log('🎨 Themes seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding themes:', error);
    throw error;
  }
}