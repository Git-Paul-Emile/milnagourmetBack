import { PrismaClient } from '@prisma/client';
import { contactData, socialMediaData } from './data/contact.js';

export async function seedContact(prisma: PrismaClient) {
  console.log('📞 Création des informations de contact...');

  const contact = await prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nomEntreprise: contactData.companyName,
      adresse: contactData.address,
      telephone: contactData.phone,
      email: contactData.email,
      whatsapp: contactData.whatsapp
    }
  });

  // Opening hours
  const dayMap: { [key: string]: string } = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  for (const [day, hours] of Object.entries(contactData.hours)) {
    const frenchDay = dayMap[day as keyof typeof dayMap];
    if (!frenchDay) continue;

    await prisma.horaireOuverture.upsert({
      where: { contactId_jour: { contactId: contact.id, jour: frenchDay } },
      update: {},
      create: {
        contactId: contact.id,
        jour: frenchDay,
        ouverture: (hours as any).open,
        fermeture: (hours as any).close,
        ferme: (hours as any).closed,
        ordre: Object.keys(dayMap).indexOf(day)
      }
    });
  }

  // Social media
  console.log('📱 Création des réseaux sociaux...');
  const socialMediaMap = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok'
  };

  for (const [platform, url] of Object.entries(socialMediaData)) {
    if (platform in socialMediaMap) {
      await prisma.reseauSocial.upsert({
        where: { plateforme: socialMediaMap[platform as keyof typeof socialMediaMap] },
        update: {},
        create: {
          plateforme: socialMediaMap[platform as keyof typeof socialMediaMap],
          url: url as string,
          active: true
        }
      });
    }
  }

  return contact;
}