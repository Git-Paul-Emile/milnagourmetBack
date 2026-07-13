import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.union([z.string(), z.number()]),
  quantity: z.number().int().positive('La quantité doit être positive')
});

export const updateCartItemSchema = z.object({
  productId: z.union([z.string(), z.number()]),
  quantity: z.number().int().min(0, 'La quantité doit être positive ou nulle')
});

export const addCustomCreationSchema = z.object({
  tailleId: z.union([z.string(), z.number()]),
  quantity: z.number().int().positive('La quantité doit être positive'),
  price: z.number().positive('Le prix doit être positif'),
  fruits: z.array(z.string()).optional(),
  sauces: z.array(z.string()).optional(),
  cereales: z.array(z.string()).optional()
});

export const updateCustomCreationSchema = z.object({
  creationId: z.union([z.string(), z.number()]),
  quantity: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  fruits: z.array(z.string()).optional(),
  sauces: z.array(z.string()).optional(),
  cereales: z.array(z.string()).optional()
});

export const checkoutSchema = z.object({
  pointsUsed: z.number().int().min(0).optional()
});
