import { z } from 'zod';

export const createPwaEventSchema = z.object({
  appareilId: z.string().uuid("Identifiant d'appareil invalide"),
  type: z.enum(['SCAN', 'INSTALLATION']),
  source: z.enum(['QRCODE', 'DIRECT']),
  plateforme: z.enum(['ios', 'android', 'autre']),
});

export type CreatePwaEventInput = z.infer<typeof createPwaEventSchema>;
