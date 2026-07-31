import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHash } from 'node:crypto';
import { creerPrismaMock, type PrismaMock } from '../test/prismaMock.js';

/**
 * Tests de la réinitialisation de mot de passe.
 *
 * Les cas couverts sont ceux qui, mal implémentés, ouvrent une faille :
 * jeton stocké en clair, lien réutilisable, lien expiré accepté,
 * sessions non invalidées, énumération de comptes.
 */

const prismaMock: PrismaMock = creerPrismaMock();

vi.mock('../config/database.js', () => ({
  prisma: prismaMock,
  connectToDatabase: vi.fn(),
}));

const envoyerLienMock = vi.fn().mockResolvedValue({ succes: true, canal: 'email', tentatives: 1 });
const confirmerChangementMock = vi.fn().mockResolvedValue(undefined);

vi.mock('./notification/notification.service.js', () => ({
  NotificationService: {
    envoyerLienReinitialisation: (...args: unknown[]) => envoyerLienMock(...args),
    confirmerChangementMotDePasse: (...args: unknown[]) => confirmerChangementMock(...args),
  },
}));

const utilisateurFactice = {
  id: 7,
  email: 'awa@exemple.com',
  nomComplet: 'Awa Nzeng',
  blocked: false,
  password: 'ancien-hash',
  tokenVersion: 3,
};

const hacher = (jeton: string) => createHash('sha256').update(jeton).digest('hex');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('demanderReinitialisation', () => {
  it('crée un jeton et envoie le lien pour un compte existant', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.utilisateur.findUnique.mockResolvedValue(utilisateurFactice);
    prismaMock.jetonReinitialisation.updateMany.mockResolvedValue({ count: 0 });
    prismaMock.jetonReinitialisation.create.mockResolvedValue({});

    await PasswordResetService.demanderReinitialisation('awa@exemple.com');

    expect(prismaMock.jetonReinitialisation.create).toHaveBeenCalledTimes(1);
    expect(envoyerLienMock).toHaveBeenCalledTimes(1);

    const arguments_ = envoyerLienMock.mock.calls[0]?.[0] as { lien: string };
    expect(arguments_.lien).toContain('/reinitialiser-mot-de-passe?token=');
  });

  it("ne stocke JAMAIS le jeton en clair — seul son empreinte est persistée", async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.utilisateur.findUnique.mockResolvedValue(utilisateurFactice);
    prismaMock.jetonReinitialisation.updateMany.mockResolvedValue({ count: 0 });
    prismaMock.jetonReinitialisation.create.mockResolvedValue({});

    await PasswordResetService.demanderReinitialisation('awa@exemple.com');

    const donneesCreees = prismaMock.jetonReinitialisation.create.mock.calls[0]?.[0] as {
      data: { tokenHash: string };
    };
    const lienEnvoye = (envoyerLienMock.mock.calls[0]?.[0] as { lien: string }).lien;
    const jetonEnClair = new URL(lienEnvoye).searchParams.get('token') ?? '';

    // Le jeton du lien ne doit pas apparaître tel quel en base…
    expect(donneesCreees.data.tokenHash).not.toBe(jetonEnClair);
    // …mais son empreinte SHA-256 doit correspondre.
    expect(donneesCreees.data.tokenHash).toBe(hacher(jetonEnClair));
  });

  it('invalide les demandes précédentes encore actives', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.utilisateur.findUnique.mockResolvedValue(utilisateurFactice);
    prismaMock.jetonReinitialisation.updateMany.mockResolvedValue({ count: 2 });
    prismaMock.jetonReinitialisation.create.mockResolvedValue({});

    await PasswordResetService.demanderReinitialisation('awa@exemple.com');

    expect(prismaMock.jetonReinitialisation.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { utilisateurId: 7, utiliseLe: null } })
    );
  });

  it("reste silencieux pour un compte inexistant (anti-énumération)", async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);

    await expect(
      PasswordResetService.demanderReinitialisation('inconnu@exemple.com')
    ).resolves.toBeUndefined();

    expect(prismaMock.jetonReinitialisation.create).not.toHaveBeenCalled();
    expect(envoyerLienMock).not.toHaveBeenCalled();
  });

  it("n'envoie rien pour un compte bloqué", async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.utilisateur.findUnique.mockResolvedValue({ ...utilisateurFactice, blocked: true });

    await PasswordResetService.demanderReinitialisation('awa@exemple.com');

    expect(envoyerLienMock).not.toHaveBeenCalled();
  });
});

describe('reinitialiser', () => {
  const jetonValide = {
    id: 99,
    utilisateurId: 7,
    tokenHash: hacher('jeton-en-clair'),
    expireLe: new Date(Date.now() + 10 * 60 * 1000),
    utiliseLe: null,
    utilisateur: utilisateurFactice,
  };

  it('remplace le mot de passe et invalide toutes les sessions', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.jetonReinitialisation.findUnique.mockResolvedValue(jetonValide);

    await PasswordResetService.reinitialiser('jeton-en-clair', 'nouveauMotDePasse1');

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.utilisateur.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        data: expect.objectContaining({ tokenVersion: { increment: 1 } }),
      })
    );

    // Le mot de passe est haché, jamais stocké en clair.
    const donnees = prismaMock.utilisateur.update.mock.calls[0]?.[0] as {
      data: { password: string };
    };
    expect(donnees.data.password).not.toBe('nouveauMotDePasse1');
    expect(donnees.data.password.startsWith('$2')).toBe(true);
  });

  it('marque le jeton comme utilisé pour empêcher un second usage', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.jetonReinitialisation.findUnique.mockResolvedValue(jetonValide);

    await PasswordResetService.reinitialiser('jeton-en-clair', 'nouveauMotDePasse1');

    expect(prismaMock.jetonReinitialisation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 99 },
        data: { utiliseLe: expect.any(Date) },
      })
    );
  });

  it('rejette un jeton inconnu', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.jetonReinitialisation.findUnique.mockResolvedValue(null);

    await expect(
      PasswordResetService.reinitialiser('jeton-bidon', 'nouveauMotDePasse1')
    ).rejects.toThrow(/invalide/i);
  });

  it('rejette un jeton déjà utilisé', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.jetonReinitialisation.findUnique.mockResolvedValue({
      ...jetonValide,
      utiliseLe: new Date(),
    });

    await expect(
      PasswordResetService.reinitialiser('jeton-en-clair', 'nouveauMotDePasse1')
    ).rejects.toThrow(/déjà été utilisé/i);
  });

  it('rejette un jeton expiré', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.jetonReinitialisation.findUnique.mockResolvedValue({
      ...jetonValide,
      expireLe: new Date(Date.now() - 1000),
    });

    await expect(
      PasswordResetService.reinitialiser('jeton-en-clair', 'nouveauMotDePasse1')
    ).rejects.toThrow(/expiré/i);
  });

  it('rejette un compte bloqué même avec un jeton valide', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.jetonReinitialisation.findUnique.mockResolvedValue({
      ...jetonValide,
      utilisateur: { ...utilisateurFactice, blocked: true },
    });

    await expect(
      PasswordResetService.reinitialiser('jeton-en-clair', 'nouveauMotDePasse1')
    ).rejects.toThrow(/bloqué/i);
  });

  it('envoie un email de confirmation après le changement', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.jetonReinitialisation.findUnique.mockResolvedValue(jetonValide);

    await PasswordResetService.reinitialiser('jeton-en-clair', 'nouveauMotDePasse1');

    expect(confirmerChangementMock).toHaveBeenCalledWith('awa@exemple.com', 'Awa Nzeng');
  });
});

describe('purgerJetonsObsoletes', () => {
  it('supprime les jetons expirés ou consommés de plus de 7 jours', async () => {
    const { PasswordResetService } = await import('./passwordReset.service.js');
    prismaMock.jetonReinitialisation.deleteMany.mockResolvedValue({ count: 12 });

    const supprimes = await PasswordResetService.purgerJetonsObsoletes();

    expect(supprimes).toBe(12);
    expect(prismaMock.jetonReinitialisation.deleteMany).toHaveBeenCalledTimes(1);
  });
});
