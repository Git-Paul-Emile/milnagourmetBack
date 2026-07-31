import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { creerPrismaMock, type PrismaMock } from '../test/prismaMock.js';

/**
 * Tests d'intégration des routes de commande.
 *
 * `POST /api/orders` est l'endpoint le plus exposé du projet : public,
 * non authentifié, et déclencheur d'une notification. On vérifie donc
 * surtout ses refus (validation, autorisation) — ce sont eux qui
 * protègent le système.
 */

const prismaMock: PrismaMock = creerPrismaMock();

vi.mock('../config/database.js', () => ({
  prisma: prismaMock,
  connectToDatabase: vi.fn(),
}));

const notifierVendeurMock = vi.fn().mockResolvedValue({ succes: true, canal: 'email', tentatives: 1 });

vi.mock('../services/notification/notification.service.js', () => ({
  NotificationService: {
    notifierVendeurNouvelleCommande: (...args: unknown[]) => notifierVendeurMock(...args),
    notifierClientStatutCommande: vi.fn().mockResolvedValue({ succes: true }),
  },
}));

const { default: app } = await import('../config/app.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/orders — validation', () => {
  it('rejette une commande sans aucun article', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        customer: { name: 'Awa', phone: '+241066000000' },
        items: [],
        total: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
  });

  it('rejette une commande sans corps de requête', async () => {
    const response = await request(app).post('/api/orders').send({});

    expect(response.status).toBe(400);
  });

  it('rejette un total négatif', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        customer: { name: 'Awa', phone: '+241066000000' },
        items: [{ id: '1', name: 'Yaourt', price: 1000, quantity: 1 }],
        total: -5000,
      });

    expect(response.status).toBe(400);
  });

  it("ne déclenche aucune notification quand la commande est rejetée", async () => {
    await request(app).post('/api/orders').send({ items: [] });

    expect(notifierVendeurMock).not.toHaveBeenCalled();
  });

  /**
   * NON-RÉGRESSION — commande invité.
   *
   * Le tunnel invité transmet un bloc `customer` sans identifiant, afin
   * de conserver l'email de suivi. `parseInt('')` vaut `NaN` : sans
   * garde, cette valeur partirait en clé étrangère vers Prisma et
   * l'insertion échouerait en 500. On vérifie donc que le traitement va
   * bien au-delà de la validation, jusqu'à la couche base.
   */
  it("traite une commande invité (customer sans identifiant) sans erreur de type", async () => {
    // Forme brute du modèle Prisma (le service la transpose ensuite).
    prismaMock.zoneLivraison.findUnique.mockResolvedValue({
      id: 1,
      nom: 'Centre-ville',
      fraisLivraison: 1000,
      tempsEstime: '30 min',
      active: true,
    });
    // Produit résolu depuis la base : le prix retenu est celui du serveur,
    // jamais celui envoyé par le client.
    prismaMock.produit.findUnique.mockResolvedValue({ id: 1, prix: 1000, disponible: true });
    prismaMock.commande.create.mockRejectedValue(new Error('base simulée'));

    const response = await request(app)
      .post('/api/orders')
      .send({
        customer: { id: '', name: 'Awa', phone: '+241066000000', email: 'awa@exemple.com' },
        items: [
          {
            id: '1',
            name: 'Yaourt',
            price: 1000,
            quantity: 1,
            product: { id: '1', category: 'creamy' },
          },
        ],
        total: 1000,
        deliveryZoneId: '1',
      });

    // Le traitement doit atteindre la couche base (échec simulé = 500) :
    // il n'a donc buté ni sur la validation, ni sur un `NaN` mal formé.
    expect(response.status).toBe(500);
    expect(response.body.message).not.toMatch(/NaN/i);
  });

  it("ignore un prix falsifié par le client et retient celui de la base", async () => {
    // Forme brute du modèle Prisma (le service la transpose ensuite).
    prismaMock.zoneLivraison.findUnique.mockResolvedValue({
      id: 1,
      nom: 'Centre-ville',
      fraisLivraison: 1000,
      tempsEstime: '30 min',
      active: true,
    });
    prismaMock.produit.findUnique.mockResolvedValue({ id: 1, prix: 5000, disponible: true });
    prismaMock.commande.create.mockResolvedValue({ id: 1 });
    prismaMock.commande.findUnique.mockResolvedValue(null);

    await request(app)
      .post('/api/orders')
      .send({
        customer: null,
        // Le client annonce 1 F pour un produit à 5000 F.
        items: [
          { id: '1', name: 'Yaourt', price: 1, quantity: 2, product: { id: '1', category: 'creamy' } },
        ],
        total: 1,
        deliveryZoneId: '1',
      });

    const donnees = prismaMock.commande.create.mock.calls[0]?.[0] as
      | { data: { montantTotal: number } }
      | undefined;

    // 2 × 5000 + 1000 de livraison = 11 000, et non le total annoncé.
    expect(donnees?.data.montantTotal).toBe(11000);
  });

  it('refuse un produit indisponible', async () => {
    // Forme brute du modèle Prisma (le service la transpose ensuite).
    prismaMock.zoneLivraison.findUnique.mockResolvedValue({
      id: 1,
      nom: 'Centre-ville',
      fraisLivraison: 1000,
      tempsEstime: '30 min',
      active: true,
    });
    prismaMock.produit.findUnique.mockResolvedValue({ id: 1, prix: 1000, disponible: false });

    const response = await request(app)
      .post('/api/orders')
      .send({
        customer: null,
        items: [
          { id: '1', name: 'Yaourt', price: 1000, quantity: 1, product: { id: '1', category: 'creamy' } },
        ],
        total: 1000,
        deliveryZoneId: '1',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/indisponible/i);
  });
});

describe('Routes de commande — contrôle d’accès', () => {
  it('refuse la liste complète des commandes à un anonyme', async () => {
    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(401);
  });

  it('refuse le détail d’une commande à un anonyme', async () => {
    const response = await request(app).get('/api/orders/1');

    expect(response.status).toBe(401);
  });

  it('refuse le changement de statut à un anonyme', async () => {
    const response = await request(app).put('/api/orders/1/status').send({ status: 'LIVREE' });

    expect(response.status).toBe(401);
  });

  it("refuse l'assignation d'un livreur à un anonyme", async () => {
    const response = await request(app)
      .put('/api/orders/1/delivery-person')
      .send({ deliveryPersonId: '1' });

    expect(response.status).toBe(401);
  });

  it("refuse l'accès aux revenus à un anonyme", async () => {
    const response = await request(app).get('/api/orders/revenue/month');

    expect(response.status).toBe(401);
  });

  it('refuse l’historique personnel sans authentification', async () => {
    const response = await request(app).get('/api/orders/my-orders');

    expect(response.status).toBe(401);
  });

  it("refuse un jeton d'utilisateur simple sur une route administrateur", async () => {
    const { generateAccessToken } = await import('../config/jwt.js');
    const jetonUtilisateur = generateAccessToken({
      userId: '1',
      telephone: '+241066000000',
      nomComplet: 'Client',
      zoneLivraisonId: null,
      role: 'USER',
    });

    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${jetonUtilisateur}`);

    // 403 et non 401 : le client est authentifié, mais pas autorisé.
    expect(response.status).toBe(403);
  });
});
