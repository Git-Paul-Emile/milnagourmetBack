import { PrismaClient } from '@prisma/client';
import { creationSizesData, creationOptionsData } from './data/creation-options.js';

export async function seedCreationOptions(prisma: PrismaClient) {
  // Seed sizes
  console.log('📏 Création des tailles de création...');
  const tailleIdMap: { [key: string]: number } = {};
  for (const size of creationSizesData) {
    const createdTaille = await prisma.tailleCreation.upsert({
      where: { nom: size.name },
      update: { image: size.image },
      create: {
        nom: size.name,
        prix: size.price,
        image: size.image,
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
    const fruit = creationOptionsData.fruits[i];
    if (fruit) {
      const createdFruit = await prisma.fruit.upsert({
        where: { nom: fruit.nom },
        update: { image: fruit.image },
        create: {
          nom: fruit.nom,
          image: fruit.image,
          ordreAffichage: i
        }
      });
      fruitIdMap[fruit.nom] = createdFruit.id;
    }
  }

  // Seed sauces
  console.log('🍯 Création des sauces...');
  const sauceIdMap: { [key: string]: number } = {};
  for (let i = 0; i < creationOptionsData.sauces.length; i++) {
    const sauce = creationOptionsData.sauces[i];
    if (sauce) {
      const createdSauce = await prisma.sauce.upsert({
        where: { nom: sauce.nom },
        update: { image: sauce.image },
        create: {
          nom: sauce.nom,
          image: sauce.image,
          ordreAffichage: i
        }
      });
      sauceIdMap[sauce.nom] = createdSauce.id;
    }
  }

  // Seed cereals
  console.log('🌾 Création des céréales...');
  const cerealeIdMap: { [key: string]: number } = {};
  for (let i = 0; i < creationOptionsData.cereales.length; i++) {
    const cereale = creationOptionsData.cereales[i];
    if (cereale) {
      const createdCereale = await prisma.cereale.upsert({
        where: { nom: cereale.nom },
        update: { image: cereale.image },
        create: {
          nom: cereale.nom,
          image: cereale.image,
          ordreAffichage: i
        }
      });
      cerealeIdMap[cereale.nom] = createdCereale.id;
    }
  }

  return { tailleIdMap, fruitIdMap, sauceIdMap, cerealeIdMap };
}