import { z } from 'zod';

export const usePointsSchema = z.object({
  pointsToUse: z.number().int().positive('Le nombre de points doit être positif')
});
