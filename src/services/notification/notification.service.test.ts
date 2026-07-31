import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CommandeWithRelations } from '../../repository/order.repository.js';
import { creerPrismaMock, type PrismaMock } from '../../test/prismaMock.js';

/**
 * Tests de l'orchestrateur de notifications.
 *
 * Ce qui est vérifié ici est exactement ce qui, en production, fait
 * perdre des commandes : le mauvais canal choisi, une reprise absente,
 * un échec silencieux non tracé.
 *
 * `vi.mock` est hissé en haut du fichier par Vitest : les mocks doivent
 * donc être déclarés avant tout import du module testé, d'où les imports
 * dynamiques dans les tests.
 */

const prismaMock: PrismaMock = creerPrismaMock();

vi.mock('../../config/database.js', () => ({
  prisma: prismaMock,
  connectToDatabase: vi.fn(),
}));

/** Commande minimale suffisante pour les gabarits. */
const commandeFactice = {
  id: 42,
  numeroCommande: 'CMD-0042',
  nomClient: 'Awa Nzeng',
  telephoneClient: '+241066000000',
  emailClient: 'awa@exemple.com',
  montantTotal: 12000,
  fraisLivraison: 1000,
  elements: [],
  creationsPersonnalisees: [],
  utilisateur: null,
  // Double cast : recréer l'intégralité du type Prisma n'apporterait rien
  // au test. `as unknown as T` conserve le type objet, contrairement à
  // `as never` qui interdirait tout spread ou accès de propriété.
} as unknown as CommandeWithRelations;

/**
 * Recharge les modules après modification des variables d'environnement.
 * `env` est figé à l'import : sans réinitialisation du registre de
 * modules, un changement de `process.env` n'aurait aucun effet.
 */
async function chargerService() {
  vi.resetModules();
  return import('./notification.service.js');
}

describe('NotificationService — choix du canal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.RESEND_API_KEY;
    delete process.env.TELNYX_API_KEY;
    delete process.env.TELNYX_WHATSAPP_FROM;
  });

  it('ne choisit aucun canal quand rien n’est configuré', async () => {
    const { NotificationService } = await chargerService();

    const choix = NotificationService.choisirCanal({
      telephone: '+241066000000',
      email: 'client@exemple.com',
    });

    expect(choix).toBeNull();
  });

  it('bascule sur l’email tant que WhatsApp n’est pas configuré', async () => {
    process.env.RESEND_API_KEY = 'cle-de-test';
    const { NotificationService } = await chargerService();

    const choix = NotificationService.choisirCanal({
      telephone: '+241066000000',
      email: 'client@exemple.com',
    });

    expect(choix?.canal.nom).toBe('email');
    expect(choix?.adresse).toBe('client@exemple.com');
  });

  it('privilégie WhatsApp dès qu’il est configuré', async () => {
    process.env.RESEND_API_KEY = 'cle-de-test';
    process.env.TELNYX_API_KEY = 'cle-telnyx';
    process.env.TELNYX_WHATSAPP_FROM = '+241000000000';
    const { NotificationService } = await chargerService();

    const choix = NotificationService.choisirCanal({
      telephone: '+241066000000',
      email: 'client@exemple.com',
    });

    expect(choix?.canal.nom).toBe('whatsapp');
  });

  it('retombe sur l’email si WhatsApp est configuré mais le destinataire n’a pas de téléphone', async () => {
    process.env.RESEND_API_KEY = 'cle-de-test';
    process.env.TELNYX_API_KEY = 'cle-telnyx';
    process.env.TELNYX_WHATSAPP_FROM = '+241000000000';
    const { NotificationService } = await chargerService();

    const choix = NotificationService.choisirCanal({
      telephone: null,
      email: 'client@exemple.com',
    });

    expect(choix?.canal.nom).toBe('email');
  });
});

describe('NotificationService — reprise sur échec', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    process.env.TELNYX_API_KEY = 'cle-telnyx';
    process.env.TELNYX_WHATSAPP_FROM = '+241000000000';
    delete process.env.RESEND_API_KEY;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('réessaie trois fois avant d’abandonner, puis rend compte de l’échec', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => 'service indisponible',
    });
    vi.stubGlobal('fetch', fetchMock);

    const { NotificationService } = await chargerService();

    const promesse = NotificationService.envoyer(
      { telephone: '+241066000000' },
      { sujet: 'Test', texte: 'Contenu' }
    );

    // Les attentes entre tentatives sont simulées : le test reste instantané.
    await vi.runAllTimersAsync();
    const resultat = await promesse;

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(resultat.succes).toBe(false);
    expect(resultat.tentatives).toBe(3);
    expect(resultat.canal).toBe('whatsapp');
    expect(resultat.erreur).toContain('503');
  });

  it('s’arrête à la première tentative réussie', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    const { NotificationService } = await chargerService();

    const promesse = NotificationService.envoyer(
      { telephone: '+241066000000' },
      { sujet: 'Test', texte: 'Contenu' }
    );
    await vi.runAllTimersAsync();
    const resultat = await promesse;

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(resultat).toEqual({ succes: true, canal: 'whatsapp', tentatives: 1 });
  });

  it('réussit à la deuxième tentative après un échec transitoire', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => 'erreur' })
      .mockResolvedValueOnce({ ok: true, status: 200, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);

    const { NotificationService } = await chargerService();

    const promesse = NotificationService.envoyer(
      { telephone: '+241066000000' },
      { sujet: 'Test', texte: 'Contenu' }
    );
    await vi.runAllTimersAsync();
    const resultat = await promesse;

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(resultat.succes).toBe(true);
    expect(resultat.tentatives).toBe(2);
  });

  it('ne tente rien et rend compte quand aucun canal n’est disponible', async () => {
    delete process.env.TELNYX_API_KEY;
    delete process.env.TELNYX_WHATSAPP_FROM;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const { NotificationService } = await chargerService();

    const resultat = await NotificationService.envoyer(
      { telephone: '+241066000000' },
      { sujet: 'Test', texte: 'Contenu' }
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(resultat.succes).toBe(false);
    expect(resultat.canal).toBeNull();
    expect(resultat.tentatives).toBe(0);
  });
});

describe('NotificationService — traçabilité sur la commande', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    process.env.TELNYX_API_KEY = 'cle-telnyx';
    process.env.TELNYX_WHATSAPP_FROM = '+241000000000';
    process.env.VENDOR_WHATSAPP_NUMBER = '+241066111111';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('inscrit le succès de la notification sur la commande', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '' })
    );
    prismaMock.commande.update.mockResolvedValue({});

    const { NotificationService } = await chargerService();

    const promesse = NotificationService.notifierVendeurNouvelleCommande(commandeFactice);
    await vi.runAllTimersAsync();
    await promesse;

    expect(prismaMock.commande.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 42 },
        data: expect.objectContaining({
          notificationEnvoyee: true,
          notificationCanal: 'whatsapp',
          notificationTentatives: 1,
          notificationErreur: null,
        }),
      })
    );
  });

  it('inscrit l’échec et son motif, pour affichage dans le dashboard', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => 'clé invalide' })
    );
    prismaMock.commande.update.mockResolvedValue({});

    const { NotificationService } = await chargerService();

    const promesse = NotificationService.notifierVendeurNouvelleCommande(commandeFactice);
    await vi.runAllTimersAsync();
    await promesse;

    const appel = prismaMock.commande.update.mock.calls[0]?.[0] as {
      data: { notificationEnvoyee: boolean; notificationErreur: string | null };
    };

    expect(appel.data.notificationEnvoyee).toBe(false);
    expect(appel.data.notificationErreur).toContain('401');
  });

  it('ne propage pas une panne d’écriture en base', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '' })
    );
    prismaMock.commande.update.mockRejectedValue(new Error('base indisponible'));

    const { NotificationService } = await chargerService();

    const promesse = NotificationService.notifierVendeurNouvelleCommande(commandeFactice);
    await vi.runAllTimersAsync();

    // La traçabilité est secondaire : son échec ne doit jamais casser le flux.
    await expect(promesse).resolves.toMatchObject({ succes: true });
  });
});
