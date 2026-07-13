import { z } from 'zod';

const customCreationSchema = z.object({
  size: z.object({ id: z.number(), nom: z.string().optional() }).passthrough().optional(),
  selectedFruits: z.array(z.string()).optional(),
  selectedSauces: z.array(z.string()).optional(),
  selectedCereales: z.array(z.string()).optional()
}).passthrough().nullable().optional();

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  quantity: z.number().int().positive('La quantité doit être positive'),
  image: z.string().optional(),
  product: z.object({ id: z.string() }).passthrough().nullable().optional(),
  customCreation: customCreationSchema
});

export const createOrderSchema = z.object({
  customer: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string().optional()
  }).passthrough().nullable().optional(),
  items: z.array(orderItemSchema).min(1, 'La commande doit contenir au moins un article'),
  total: z.number().optional(),
  deliveryFee: z.number().optional(),
  deliveryZoneId: z.string().optional(),
  status: z.string().optional(),
  date: z.string().optional(),
  notes: z.string().optional(),
  pointsUsed: z.number().int().min(0).optional(),
  pointsDiscount: z.number().optional()
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['RECU', 'LIVREE', 'ANNULEE', 'recu', 'livree', 'annulee'])
});

export const assignDeliveryPersonSchema = z.object({
  livreurId: z.union([z.string(), z.number(), z.null()]).optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
