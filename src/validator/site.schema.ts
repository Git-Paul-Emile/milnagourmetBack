import { z } from 'zod';

export const updateBrandingSchema = z.object({
  logo: z.string().min(1, 'Le logo est requis')
});

export const updateAvatarToastSchema = z.object({
  image: z.string().min(1, "L'image est requise")
});

export const updateContactSchema = z.object({
  companyName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  whatsapp: z.string().optional()
});

const socialMediaEntrySchema = z.object({
  plateforme: z.string().min(1),
  url: z.string().min(1),
  active: z.boolean()
});

export const updateSocialMediaSchema = z.array(socialMediaEntrySchema);

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  location: z.string().min(1, 'Le lieu est requis'),
  rating: z.coerce.number().int().min(1).max(5, 'La note doit être comprise entre 1 et 5'),
  comment: z.string().min(1, 'Le commentaire est requis').max(200, 'Le commentaire ne doit pas dépasser 200 caractères'),
  avatar: z.string().optional(),
  active: z.boolean().optional()
});

export const updateTestimonialSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  comment: z.string().max(200, 'Le commentaire ne doit pas dépasser 200 caractères').optional(),
  avatar: z.string().optional(),
  active: z.boolean().optional()
});

export const updateHeroSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  badge: z.string().optional(),
  banner: z.string().optional()
});

export const updateCatalogSectionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  creationTitle: z.string().optional(),
  creationDescription: z.string().optional(),
  creationButtonText: z.string().optional(),
  creationImage: z.string().optional(),
  emptyMessage: z.string().optional(),
  emptySubMessage: z.string().optional()
});

const dayHoursSchema = z.object({
  day: z.string().min(1),
  open: z.string(),
  close: z.string(),
  closed: z.boolean()
});

export const updateStoreHoursSchema = z.object({
  hours: z.array(dayHoursSchema).min(1, 'Les horaires sont requis')
});
