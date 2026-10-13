import { PrismaClient } from '@prisma/client';
import { testimonialsData } from './data/testimonials.js';

export async function seedTestimonials(prisma: PrismaClient, onlyIds?: number[]) {
  console.log('💬 Création des témoignages...');

  const selectedTestimonials = onlyIds
    ? testimonialsData.filter(testimonial => onlyIds.includes(testimonial.id))
    : testimonialsData;

  if (onlyIds && selectedTestimonials.length !== new Set(onlyIds).size) {
    throw new Error('Un ou plusieurs témoignages demandés ne sont pas présents dans les données de seed.');
  }

  for (const testimonial of selectedTestimonials) {
    await prisma.temoinage.upsert({
      where: { id: testimonial.id },
      update: {
        lieu: testimonial.location,
        commentaire: testimonial.comment
      },
      create: {
        nom: testimonial.name,
        lieu: testimonial.location,
        note: testimonial.rating,
        commentaire: testimonial.comment,
        avatar: testimonial.avatar,
        date: new Date(testimonial.date),
        active: true
      }
    });
  }
}