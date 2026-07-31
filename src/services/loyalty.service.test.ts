import { describe, it, expect, vi, beforeEach } from 'vitest';
import { creerPrismaMock, type PrismaMock } from '../test/prismaMock.js';

/**
 * Tests du programme de fidélité.
 *
 * Ces calculs déterminent combien un client paie réellement. Une erreur
 * d'arrondi ou de seuil se traduit directement par une perte financière
 * ou par un client facturé au mauvais prix — d'où une couverture serrée
 * des cas limites.
 */

const prismaMock: PrismaMock = creerPrismaMock();

vi.mock('../config/database.js', () => ({
  prisma: prismaMock,
  connectToDatabase: vi.fn(),
}));

const { LoyaltyService } = await import('./loyalty.service.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LoyaltyService — conversions', () => {
  it('convertit un montant en points (1 point pour 15 F)', () => {
    // 1500 F / 15 = 100 points
    expect(LoyaltyService.calculatePoints(1500)).toBe(100);
  });

  it('arrondit les points à deux décimales', () => {
    // 1000 / 15 = 66,666… → 66,67
    expect(LoyaltyService.calculatePoints(1000)).toBe(66.67);
  });

  it('ne crédite aucun point pour un montant nul', () => {
    expect(LoyaltyService.calculatePoints(0)).toBe(0);
  });

  it('convertit des points en francs', () => {
    expect(LoyaltyService.pointsToCFA(100)).toBe(1500);
  });

  it('les deux conversions sont réciproques', () => {
    const montant = 3000;
    const points = LoyaltyService.calculatePoints(montant);

    expect(LoyaltyService.pointsToCFA(points)).toBe(montant);
  });
});

describe('LoyaltyService — seuil d’utilisation', () => {
  it('refuse en dessous de 100 points', () => {
    expect(LoyaltyService.canUsePoints(99.99)).toBe(false);
  });

  it('accepte exactement au seuil de 100 points', () => {
    // Cas limite classique : une erreur de `>` au lieu de `>=` bloquerait
    // tous les clients pile au seuil.
    expect(LoyaltyService.canUsePoints(100)).toBe(true);
  });

  it('accepte au-delà du seuil', () => {
    expect(LoyaltyService.canUsePoints(250)).toBe(true);
  });

  it('refuse un solde nul', () => {
    expect(LoyaltyService.canUsePoints(0)).toBe(false);
  });
});

describe('LoyaltyService — progression vers le seuil', () => {
  it('indique le pourcentage atteint', () => {
    expect(LoyaltyService.getProgressPercentage(50)).toBe(50);
  });

  it('plafonne à 100 % au-delà du seuil', () => {
    expect(LoyaltyService.getProgressPercentage(500)).toBe(100);
  });

  it('indique les points restants avant le seuil', () => {
    expect(LoyaltyService.getPointsToNextThreshold(30)).toBe(70);
  });

  it('n’indique aucun reste une fois le seuil franchi', () => {
    expect(LoyaltyService.getPointsToNextThreshold(150)).toBe(0);
  });
});

describe('LoyaltyService — utilisation des points', () => {
  it('refuse d’utiliser des points sous le seuil', () => {
    prismaMock.utilisateur.findUnique.mockResolvedValue({ pointsFidelite: 50 });

    return expect(LoyaltyService.usePoints(1, 50)).rejects.toThrow(/insuffisants|seuil/i);
  });

  it('plafonne la remise au solde réellement disponible', async () => {
    // Le client demande 500 points mais n'en a que 120 : on ne doit
    // jamais accorder plus que le solde, ni passer en négatif.
    prismaMock.utilisateur.findUnique.mockResolvedValue({ pointsFidelite: 120 });

    const remise = await LoyaltyService.usePoints(1, 500);

    expect(remise).toBe(LoyaltyService.pointsToCFA(120));
  });

  it('accorde exactement la remise demandée quand le solde suffit', async () => {
    prismaMock.utilisateur.findUnique.mockResolvedValue({ pointsFidelite: 400 });

    const remise = await LoyaltyService.usePoints(1, 200);

    expect(remise).toBe(LoyaltyService.pointsToCFA(200));
  });

  it('refuse pour un utilisateur inconnu', () => {
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);

    return expect(LoyaltyService.usePoints(999, 200)).rejects.toThrow();
  });
});
