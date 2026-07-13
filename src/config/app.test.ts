import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('app', () => {
  it('renvoie 404 avec un message JSON pour une route inconnue', async () => {
    const response = await request(app).get('/api/route-inexistante');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Route non trouvée' });
  });

  it("n'expose plus de fichiers statiques sous /uploads (médias migrés vers Cloudinary)", async () => {
    const response = await request(app).get('/uploads/produits/quelconque.jpg');

    expect(response.status).toBe(404);
  });

  it('documente l\'API sur /api-docs', async () => {
    const response = await request(app).get('/api-docs/');

    expect(response.status).toBe(200);
  });
});
