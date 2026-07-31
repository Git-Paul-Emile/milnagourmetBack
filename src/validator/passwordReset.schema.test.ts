import { describe, it, expect } from 'vitest';
import { forgotPasswordSchema, resetPasswordSchema } from './passwordReset.schema.js';

describe('forgotPasswordSchema', () => {
  it('accepte une adresse valide et la normalise en minuscules', () => {
    const resultat = forgotPasswordSchema.safeParse({ email: '  Awa@Exemple.COM  ' });

    expect(resultat.success).toBe(true);
    if (resultat.success) {
      expect(resultat.data.email).toBe('awa@exemple.com');
    }
  });

  it('rejette une adresse malformée', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'pas-une-adresse' }).success).toBe(false);
  });

  it('rejette une adresse vide', () => {
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  const valide = {
    token: 'a'.repeat(64),
    password: 'motDePasseSolide',
    confirmPassword: 'motDePasseSolide',
  };

  it('accepte une réinitialisation valide', () => {
    expect(resetPasswordSchema.safeParse(valide).success).toBe(true);
  });

  it('rejette un mot de passe de moins de 8 caractères', () => {
    const resultat = resetPasswordSchema.safeParse({
      ...valide,
      password: 'court',
      confirmPassword: 'court',
    });

    expect(resultat.success).toBe(false);
    if (!resultat.success) {
      expect(resultat.error.issues[0]?.message).toMatch(/8 caractères/);
    }
  });

  it('rejette deux mots de passe différents', () => {
    const resultat = resetPasswordSchema.safeParse({
      ...valide,
      confirmPassword: 'autreMotDePasse',
    });

    expect(resultat.success).toBe(false);
    if (!resultat.success) {
      expect(resultat.error.issues[0]?.path).toContain('confirmPassword');
    }
  });

  it('rejette un jeton absent', () => {
    expect(resetPasswordSchema.safeParse({ ...valide, token: '' }).success).toBe(false);
  });
});
