import { z } from 'zod';

// lightColors/darkColors sont des objets de variables CSS (clé -> valeur), stockés en JSON
const colorMapSchema = z.record(z.string(), z.unknown());

export const createThemeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  lightColors: colorMapSchema,
  darkColors: colorMapSchema.optional()
});

export const updateThemeSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  lightColors: colorMapSchema.optional(),
  darkColors: colorMapSchema.optional()
});
