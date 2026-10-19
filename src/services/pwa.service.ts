import pwaRepository from '../repository/pwa.repository.js';
import type { CreatePwaEventInput } from '../validator/pwa.schema.js';

export interface PwaStats {
  scansQrCode: number;
  installationsQrCode: number;
  installationsDirectes: number;
  installationsParPlateforme: Record<'ios' | 'android' | 'autre', number>;
}

class PwaService {
  async enregistrerEvenement(evenement: CreatePwaEventInput) {
    await pwaRepository.enregistrer(evenement);
  }

  async obtenirStatistiques(): Promise<PwaStats> {
    const lignes = await pwaRepository.compterParTypeEtSource();
    const stats: PwaStats = {
      scansQrCode: 0,
      installationsQrCode: 0,
      installationsDirectes: 0,
      installationsParPlateforme: { ios: 0, android: 0, autre: 0 },
    };

    for (const { type, source, plateforme, _count } of lignes) {
      const total = _count._all;
      if (type === 'SCAN') {
        if (source === 'QRCODE') stats.scansQrCode += total;
        continue;
      }
      if (source === 'QRCODE') stats.installationsQrCode += total;
      else stats.installationsDirectes += total;
      // Valeur validée à l'écriture (pwa.schema) : toujours ios, android ou autre.
      stats.installationsParPlateforme[plateforme as keyof PwaStats['installationsParPlateforme']] += total;
    }

    return stats;
  }
}

export default new PwaService();
