import { PrismaClient } from '@prisma/client';
import { creationSizesData, creationOptionsData } from './data/creation-options.js';

export async function seedCreationOptions(prisma: PrismaClient) {
  // Seed sizes
  console.log('📏 Création des tailles de création...');
  const tailleIdMap: { [key: string]: number } = {};
  for (const size of creationSizesData) {
    const createdTaille = await prisma.tailleCreation.upsert({
      where: { nom: size.name },
      update: {},
      create: {
        nom: size.name,
        prix: size.price,
        maxFruits: size.fruits,
        maxSauces: size.sauces,
        cerealesAutorise: size.cereales
      }
    });
    tailleIdMap[size.name] = createdTaille.id;
  }

  // Seed fruits
  console.log('🍓 Création des fruits...');
  const fruitIdMap: { [key: string]: number } = {};
  for (let i = 0; i < creationOptionsData.fruits.length; i++) {
    const fruitName = creationOptionsData.fruits[i];
    if (fruitName) {
      const createdFruit = await prisma.fruit.upsert({
        where: { nom: fruitName },
        update: {},
        create: {
          nom: fruitName,
          ordreAffichage: i
        }
      });
      fruitIdMap[fruitName] = createdFruit.id;
    }
  }

  // Seed sauces
  console.log('🍯 Création des sauces...');
  const sauceIdMap: { [key: string]: number } = {};
  for (let i = 0; i < creationOptionsData.sauces.length; i++) {
    const sauceName = creationOptionsData.sauces[i];
    if (sauceName) {
      const createdSauce = await prisma.sauce.upsert({
        where: { nom: sauceName },
        update: {},
        create: {
          nom: sauceName,
          ordreAffichage: i
        }
      });
      sauceIdMap[sauceName] = createdSauce.id;
    }
  }

  // Seed cereals
  console.log('🌾 Création des céréales...');
  const cerealeIdMap: { [key: string]: number } = {};
  for (let i = 0; i < creationOptionsData.cereales.length; i++) {
    const cerealeName = creationOptionsData.cereales[i];
    if (cerealeName) {
      const createdCereale = await prisma.cereale.upsert({
        where: { nom: cerealeName },
        update: {},
        create: {
          nom: cerealeName,
          ordreAffichage: i
        }
      });
      cerealeIdMap[cerealeName] = createdCereale.id;
    }
  }

  return { tailleIdMap, fruitIdMap, sauceIdMap, cerealeIdMap };
}