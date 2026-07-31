import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { creerPrismaMock, type PrismaMock } from '../test/prismaMock.js';

/**
 * Tests d'intégration des routes d'authentification.
 *
 * On vérifie ici la chaîne complète : validation Zod, gestion du cookie
 * de refresh, contrôle d'accès des routes protégées.
 */

const prismaMock: PrismaMock = creerPrismaMock();

vi.mock('../config/database.js', () => ({
  prisma: prismaMock,
  connectToDatabase: vi.fn(),
}));

const { default: app } = await import('../config/app.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/auth/register — validation', () => {
  const valide = {
    telephone: '+241066000000',
    nomComplet: 'Awa Nzeng',
    zoneLivraisonId: '1',
    password: 'motdepasse',
    confirmPassword: 'motdepasse',
  };

  it('rejette une inscription sans nom complet', async () => {
    const { nomComplet: _, ...sansNom } = valide;
    const response = await request(app).post('/api/auth/register').send(sansNom);

    expect(response.status).toBe(400);
  });

  it('rejette des mots de passe qui ne correspondent pas', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...valide, confirmPassword: 'different' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/correspondent pas/i);
  });

  it('rejette un téléphone au format invalide', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...valide, telephone: 'pas-un-numero' });

    expect(response.status).toBe(400);
  });

  it('rejette une adresse email malformée', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...valide, email: 'pas-une-adresse' });

    expect(response.status).toBe(400);
  });

  it('accepte une inscription sans email (champ facultatif)', async () => {
    // La validation doit passer : l'échec éventuel vient ensuite de la
    // base (mockée), pas du schéma.
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);
    prismaMock.utilisateur.create.mockRejectedValue(new Error('base simulée'));

    const response = await request(app).post('/api/auth/register').send(valide);

    expect(response.status).not.toBe(400);
  });

  /**
   * NON-RÉGRESSION — double validation.
   *
   * `registerSchema` TRANSFORME `zoneLivraisonId` de `string` en
   * `number`. Le middleware `validateResource` réécrit `req.body` avec
   * le résultat transformé. Si le service revalidait ces mêmes données,
   * le schéma recevrait un nombre là où il attend une chaîne et TOUTE
   * inscription échouerait en 400 « expected string, received number ».
   *
   * Ce test verrouille le comportement : un payload parfaitement valide
   * ne doit jamais produire une erreur de validation.
   */
  it("n'échoue pas sur une double validation du schéma (régression)", async () => {
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);
    prismaMock.utilisateur.create.mockRejectedValue(new Error('base simulée'));

    const response = await request(app).post('/api/auth/register').send(valide);

    expect(response.body.message ?? '').not.toMatch(/expected string, received number/i);
    expect(response.status).not.toBe(400);
  });

  it('accepte une inscription avec un email valide', async () => {
    prismaMock.utilisateur.findUnique.mockResolvedValue(null);
    prismaMock.utilisateur.create.mockRejectedValue(new Error('base simulée'));

    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...valide, email: 'Awa@Exemple.COM' });

    expect(response.status).not.toBe(400);
  });
});

describe('POST /api/auth/login — validation', () => {
  it('rejette une connexion sans mot de passe', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ telephone: '+241066000000' });

    expect(response.status).toBe(400);
  });

  it('rejette une connexion sans téléphone', async () => {
    const response = await request(app).post('/api/auth/login').send({ password: 'motdepasse' });

    expect(response.status).toBe(400);
  });
});

describe('Routes protégées — contrôle d’accès', () => {
  it('refuse /me sans jeton', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
  });

  it('refuse la mise à jour du profil sans jeton', async () => {
    const response = await request(app).put('/api/auth/profile').send({ nom: 'Nouveau nom' });

    expect(response.status).toBe(401);
  });

  it('refuse la suppression de compte sans jeton', async () => {
    const response = await request(app).delete('/api/auth/account');

    expect(response.status).toBe(401);
  });

  it('refuse la déconnexion globale sans jeton', async () => {
    const response = await request(app).post('/api/auth/logout-all');

    expect(response.status).toBe(401);
  });
});

describe('POST /api/auth/refresh', () => {
  it('refuse un renouvellement sans cookie de refresh', async () => {
    const response = await request(app).post('/api/auth/refresh');

    expect(response.status).toBe(401);
  });

  it('refuse un jeton de refresh invalide', async () => {
    const response = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', 'refreshToken=jeton.invalide.xyz');

    expect(response.status).toBe(401);
  });
});
