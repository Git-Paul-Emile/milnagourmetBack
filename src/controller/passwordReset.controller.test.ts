import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { creerPrismaMock, type PrismaMock } from '../test/prismaMock.js';

/**
 * Tests d'intégration des routes de réinitialisation.
 *
 * Contrairement aux tests unitaires du service, ceux-ci traversent toute
 * la chaîne HTTP : rate limiting → validation Zod → contrôleur →
 * service → gestionnaire d'erreurs. C'est le seul niveau où l'on peut
 * vérifier qu'un payload invalide donne bien un 400 et non un 500.
 */

const prismaMock: PrismaMock = creerPrismaMock();

vi.mock('../config/database.js', () => ({
  prisma: prismaMock,
  connectToDatabase: vi.fn(),
}));

const demanderMock = vi.fn().mockResolvedValue(undefined);
const reinitialiserMock = vi.fn().mockResolvedValue(undefined);

vi.mock('../services/passwordReset.service.js', () => ({
  PasswordResetService: {
    demanderReinitialisation: (...args: unknown[]) => demanderMock(...args),
    reinitialiser: (...args: unknown[]) => reinitialiserMock(...args),
  },
}));

const { default: app } = await import('../config/app.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/auth/forgot-password', () => {
  it('accepte une adresse valide et renvoie un message neutre', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'awa@exemple.com' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(demanderMock).toHaveBeenCalledWith('awa@exemple.com');
  });

  it('normalise la casse avant de transmettre au service', async () => {
    await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: '  AWA@Exemple.COM  ' });

    expect(demanderMock).toHaveBeenCalledWith('awa@exemple.com');
  });

  it("renvoie EXACTEMENT le même message pour un compte inexistant (anti-énumération)", async () => {
    const existant = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'awa@exemple.com' });

    const inexistant = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'personne@exemple.com' });

    expect(inexistant.status).toBe(existant.status);
    expect(inexistant.body.message).toBe(existant.body.message);
  });

  it('rejette une adresse malformée en 400', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'pas-une-adresse' });

    expect(response.status).toBe(400);
    expect(demanderMock).not.toHaveBeenCalled();
  });

  it('rejette une requête sans adresse en 400', async () => {
    const response = await request(app).post('/api/auth/forgot-password').send({});

    expect(response.status).toBe(400);
  });
});

describe('POST /api/auth/reset-password', () => {
  const payloadValide = {
    token: 'a'.repeat(64),
    password: 'motDePasseSolide',
    confirmPassword: 'motDePasseSolide',
  };

  it('applique le nouveau mot de passe', async () => {
    const response = await request(app).post('/api/auth/reset-password').send(payloadValide);

    expect(response.status).toBe(200);
    expect(reinitialiserMock).toHaveBeenCalledWith('a'.repeat(64), 'motDePasseSolide');
  });

  it('rejette un mot de passe trop court sans appeler le service', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ ...payloadValide, password: 'court', confirmPassword: 'court' });

    expect(response.status).toBe(400);
    expect(reinitialiserMock).not.toHaveBeenCalled();
  });

  it('rejette deux mots de passe différents', async () => {
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ ...payloadValide, confirmPassword: 'autreMotDePasse' });

    expect(response.status).toBe(400);
  });

  it("traduit une erreur métier du service en code HTTP approprié", async () => {
    const { AppError } = await import('../utils/AppError.js');
    reinitialiserMock.mockRejectedValueOnce(new AppError('Ce lien a expiré.', 400));

    const response = await request(app).post('/api/auth/reset-password').send(payloadValide);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/expiré/i);
  });

  it("ne divulgue pas le détail d'une erreur inattendue", async () => {
    reinitialiserMock.mockRejectedValueOnce(
      new Error('relation "password_reset_tokens" does not exist')
    );

    const response = await request(app).post('/api/auth/reset-password').send(payloadValide);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Erreur interne du serveur');
    // Le nom de la table ne doit jamais atteindre le client.
    expect(JSON.stringify(response.body)).not.toContain('password_reset_tokens');
  });
});
