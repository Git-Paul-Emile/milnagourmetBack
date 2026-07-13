import { z } from 'zod';

/**
 * Schéma de base pour les query params de pagination/recherche/tri, partagé par toutes
 * les ressources listables. `page` et `limit` sont volontairement optionnels : quand ils
 * sont absents, l'endpoint reste rétro-compatible et renvoie la liste complète (comportement
 * historique), pour ne pas casser les écrans qui ne consomment pas encore la pagination.
 */
const basePaginationSchema = z.object({
  page: z.coerce.number('La page doit être un nombre').int().positive('La page doit être positive').optional(),
  limit: z.coerce.number('La limite doit être un nombre').int().positive('La limite doit être positive').max(100, 'La limite ne peut pas dépasser 100').optional(),
  search: z.string().trim().min(1).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const orderQuerySchema = basePaginationSchema.extend({
  sortBy: z.enum(['date', 'total', 'status']).optional(),
  status: z.enum(['RECU', 'LIVREE', 'ANNULEE', 'recu', 'livree', 'annulee']).optional()
});

export const userQuerySchema = basePaginationSchema.extend({
  sortBy: z.enum(['name', 'orders', 'date']).optional(),
  blocked: z.enum(['true', 'false']).optional()
});

export const productQuerySchema = basePaginationSchema.extend({
  sortBy: z.enum(['name', 'price', 'date']).optional(),
  category: z.string().trim().min(1).optional(),
  disponible: z.enum(['true', 'false']).optional()
});

export type OrderQuery = z.infer<typeof orderQuerySchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
