import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from './auth.schema.js';
describe('registerSchema', () => {
    const validPayload = {
        telephone: '+241066100304',
        nomComplet: 'Jean Dupont',
        zoneLivraisonId: '1',
        password: 'motdepasse',
        confirmPassword: 'motdepasse'
    };
    it('accepte une inscription valide et convertit zoneLivraisonId en nombre', () => {
        const result = registerSchema.safeParse(validPayload);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.zoneLivraisonId).toBe(1);
        }
    });
    it('rejette une inscription si les mots de passe ne correspondent pas', () => {
        const result = registerSchema.safeParse({ ...validPayload, confirmPassword: 'autre' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0]?.path).toContain('confirmPassword');
        }
    });
    it('rejette un mot de passe trop court', () => {
        const result = registerSchema.safeParse({ ...validPayload, password: 'ab', confirmPassword: 'ab' });
        expect(result.success).toBe(false);
    });
    it('rejette un numéro de téléphone au format invalide', () => {
        const result = registerSchema.safeParse({ ...validPayload, telephone: 'pas-un-numero' });
        expect(result.success).toBe(false);
    });
    it('rejette un zoneLivraisonId non numérique', () => {
        const result = registerSchema.safeParse({ ...validPayload, zoneLivraisonId: 'abc' });
        expect(result.success).toBe(false);
    });
});
describe('loginSchema', () => {
    it('accepte des identifiants valides', () => {
        const result = loginSchema.safeParse({ telephone: '+241066100304', password: 'motdepasse' });
        expect(result.success).toBe(true);
    });
    it('rejette un téléphone vide', () => {
        const result = loginSchema.safeParse({ telephone: '', password: 'motdepasse' });
        expect(result.success).toBe(false);
    });
    it('accepte un panier invité optionnel', () => {
        const result = loginSchema.safeParse({
            telephone: '+241066100304',
            password: 'motdepasse',
            guestCart: [{ id: '1', name: 'Yaourt', price: 500, quantity: 2 }]
        });
        expect(result.success).toBe(true);
    });
});
//# sourceMappingURL=auth.schema.test.js.map