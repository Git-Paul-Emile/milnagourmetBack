import { prisma } from '../config/database.js';
import type { CreatePwaEventInput } from '../validator/pwa.schema.js';

class PwaRepository {
  /** Idempotent : un appareil n'est compté qu'une fois par type d'événement. */
  async enregistrer(evenement: CreatePwaEventInput) {
    return prisma.evenementPwa.upsert({
      where: { appareilId_type: { appareilId: evenement.appareilId, type: evenement.type } },
      create: evenement,
      update: {},
    });
  }

  async compterParTypeEtSource() {
    return prisma.evenementPwa.groupBy({
      by: ['type', 'source', 'plateforme'],
      _count: { _all: true },
    });
  }
}

export default new PwaRepository();
