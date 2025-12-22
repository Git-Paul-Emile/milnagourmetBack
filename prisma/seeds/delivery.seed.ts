import { PrismaClient } from '@prisma/client';
import { deliveryZonesData, deliveryPersonsData } from './data/delivery.js';

export async function seedDelivery(prisma: PrismaClient) {
  console.log('🚚 Création des zones de livraison...');

  const zoneIdMap: { [key: string]: number } = {};
  for (const zone of deliveryZonesData) {
    const createdZone = await prisma.zoneLivraison.upsert({
      where: { id: parseInt(zone.id) },
      update: {},
      create: {
        id: parseInt(zone.id),
        nom: zone.name,
        fraisLivraison: zone.deliveryFee,
        tempsEstime: zone.estimatedTime,
        active: zone.active
      }
    });
    zoneIdMap[zone.id] = createdZone.id;
  }

  // Seed delivery persons
  console.log('🚴 Création des livreurs...');
  const livreurIdMap: { [key: string]: number } = {};
  for (const deliveryPerson of deliveryPersonsData) {
    const livreur = await prisma.livreur.upsert({
      where: { id: parseInt(deliveryPerson.id) },
      update: {},
      create: {
        id: parseInt(deliveryPerson.id),
        nomComplet: deliveryPerson.nomComplet,
        telephone: deliveryPerson.phone,
        vehicule: deliveryPerson.vehicle,
        active: deliveryPerson.active
      }
    });
    livreurIdMap[deliveryPerson.id] = livreur.id;
  }

  return { zoneIdMap, livreurIdMap };
}