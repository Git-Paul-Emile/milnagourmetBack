import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateToken } from './auth.middleware.js';
import { requireAdmin } from './admin.middleware.js';
import { AppError } from './AppError.js';
import { generateAccessToken } from '../config/jwt.js';
/**
 * Tests des middlewares d'autorisation.
 *
 * Ce sont les gardiens de toutes les routes sensibles. Une régression
 * ici ouvre l'ensemble du dashboard administrateur au public : c'est le
 * code du projet dont l'échec coûte le plus cher, et il doit donc être
 * couvert en priorité.
 */
/** Construit une requête Express minimale pour le test. */
function requeteFactice(authorization, method = 'GET') {
    return { headers: authorization ? { authorization } : {}, method };
}
const reponseFactice = {};
function jetonPour(role) {
    return generateAccessToken({
        userId: '1',
        telephone: '+241066000000',
        nomComplet: 'Test',
        zoneLivraisonId: null,
        role,
    });
}
let next;
beforeEach(() => {
    next = vi.fn();
});
describe('authenticateToken', () => {
    it('laisse passer une requête munie d’un jeton valide', () => {
        const req = requeteFactice(`Bearer ${jetonPour('USER')}`);
        authenticateToken(req, reponseFactice, next);
        expect(next).toHaveBeenCalledWith();
        expect(req.user?.role).toBe('USER');
    });
    it('rejette une requête sans en-tête Authorization (401)', () => {
        authenticateToken(requeteFactice(), reponseFactice, next);
        const erreur = next.mock.calls[0]?.[0];
        expect(erreur).toBeInstanceOf(AppError);
        expect(erreur.statusCode).toBe(401);
    });
    it('rejette un en-tête mal formé (sans préfixe Bearer)', () => {
        authenticateToken(requeteFactice(jetonPour('USER')), reponseFactice, next);
        expect((next.mock.calls[0]?.[0]).statusCode).toBe(401);
    });
    it('rejette un jeton falsifié', () => {
        authenticateToken(requeteFactice('Bearer jeton.completement.invalide'), reponseFactice, next);
        const erreur = next.mock.calls[0]?.[0];
        expect(erreur.statusCode).toBe(401);
        expect(erreur.message).toBe('Token invalide');
    });
});
describe('requireAdmin', () => {
    it('laisse passer un administrateur', () => {
        const req = requeteFactice(`Bearer ${jetonPour('ADMIN')}`);
        requireAdmin(req, reponseFactice, next);
        expect(next).toHaveBeenCalledWith();
        expect(req.user?.role).toBe('ADMIN');
    });
    it('refuse un utilisateur authentifié mais non administrateur (403)', () => {
        requireAdmin(requeteFactice(`Bearer ${jetonPour('USER')}`), reponseFactice, next);
        const erreur = next.mock.calls[0]?.[0];
        expect(erreur.statusCode).toBe(403);
        expect(erreur.message).toMatch(/administrateur/i);
    });
    it('refuse une requête anonyme (401)', () => {
        requireAdmin(requeteFactice(), reponseFactice, next);
        expect((next.mock.calls[0]?.[0]).statusCode).toBe(401);
    });
    it('laisse passer les requêtes OPTIONS (préflight CORS)', () => {
        // Le navigateur envoie le préflight SANS en-tête Authorization :
        // le bloquer casserait tous les appels cross-origin authentifiés.
        requireAdmin(requeteFactice(undefined, 'OPTIONS'), reponseFactice, next);
        expect(next).toHaveBeenCalledWith();
    });
});
//# sourceMappingURL=authorization.test.js.map