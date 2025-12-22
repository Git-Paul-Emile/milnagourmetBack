import { PrismaClient } from '@prisma/client';
import { testimonialsData } from './data/testimonials.js';

export async function seedTestimonials(prisma: PrismaClient) {
  console.log('💬 Création des témoignages...');

  for (const testimonial of testimonialsData) {
    await prisma.temoinage.upsert({
      where: { id: testimonial.id },
      update: {},
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