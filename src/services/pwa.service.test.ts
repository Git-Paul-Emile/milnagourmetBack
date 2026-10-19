import { describe, it, expect, vi } from 'vitest';

vi.mock('../repository/pwa.repository.js', () => ({
  default: {
    enregistrer: vi.fn(),
    compterParTypeEtSource: vi.fn().mockResolvedValue([
      { type: 'SCAN', source: 'QRCODE', plateforme: 'android', _count: { _all: 5 } },
      { type: 'SCAN', source: 'QRCODE', plateforme: 'ios', _count: { _all: 3 } },
      { type: 'INSTALLATION', source: 'QRCODE', plateforme: 'android', _count: { _all: 2 } },
      { type: 'INSTALLATION', source: 'DIRECT', plateforme: 'ios', _count: { _all: 4 } },
      { type: 'INSTALLATION', source: 'DIRECT', plateforme: 'android', _count: { _all: 1 } },
    ]),
  },
}));

const { default: pwaService } = await import('./pwa.service.js');

describe('PwaService.obtenirStatistiques', () => {
  it('sépare les installations via QR code et directes', async () => {
    await expect(pwaService.obtenirStatistiques()).resolves.toEqual({
      scansQrCode: 8,
      installationsQrCode: 2,
      installationsDirectes: 5,
      installationsParPlateforme: { ios: 4, android: 3, autre: 0 },
    });
  });
});
