import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';

/**
 * Tests d'intégration de l'assemblage Express.
 *
 * Ils ne touchent pas la base : ils vérifient la chaîne de middlewares,
 * qui est précisément ce qu'un test unitaire ne peut pas couvrir.
 */

describe('app — routage', () => {
  it('renvoie 404 avec un corps JSON normalisé pour une route inconnue', async () => {
    const response = await request(app).get('/api/route-inexistante');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ status: 'error', message: 'Route non trouvée' });
  });

  it("n'expose plus de fichiers statiques sous /uploads (médias migrés vers Cloudinary)", async () => {
    const response = await request(app).get('/uploads/produits/quelconque.jpg');

    expect(response.status).toBe(404);
  });

  it("documente l'API sur /api-docs hors production", async () => {
    const response = await request(app).get('/api-docs/');

    expect(response.status).toBe(200);
  });
});

describe('app — en-têtes de sécurité', () => {
  it('interdit au navigateur de deviner le type des contenus', async () => {
    const response = await request(app).get('/api/route-inexistante');

    // Sans cet en-tête, un fichier texte contenant du HTML peut être
    // interprété comme une page — vecteur classique de XSS.
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it("empêche l'affichage du site dans une iframe tierce (clickjacking)", async () => {
    const response = await request(app).get('/api/route-inexistante');

    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('masque la technologie du serveur', async () => {
    const response = await request(app).get('/api/route-inexistante');

    // helmet retire `X-Powered-By: Express`, qui indique gratuitement à un
    // attaquant quelles failles connues essayer.
    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});

describe('app — CORS', () => {
  it('autorise une origine déclarée', async () => {
    const response = await request(app)
      .get('/api/route-inexistante')
      .set('Origin', 'http://localhost:8080');

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:8080');
  });

  it("n'autorise pas une origine inconnue", async () => {
    const response = await request(app)
      .get('/api/route-inexistante')
      .set('Origin', 'https://site-malveillant.example');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('app — gestion des erreurs', () => {
  it('renvoie un JSON structuré et non du HTML sur une requête malformée', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ json invalide');

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('status', 'error');
  });
});
