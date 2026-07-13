import { describe, it, expect } from 'vitest';
import { sanitizeFileBaseName } from './cloudinary.js';

describe('sanitizeFileBaseName', () => {
  it('met en minuscules et remplace les espaces par des tirets', () => {
    expect(sanitizeFileBaseName('Yaourt Nature.jpg')).toBe('yaourt-nature');
  });

  it('retire les accents', () => {
    expect(sanitizeFileBaseName('Écran Été.png')).toBe('ecran-ete');
  });

  it('remplace les caractères spéciaux par des tirets simples', () => {
    expect(sanitizeFileBaseName('photo__produit!!2024.webp')).toBe('photo-produit-2024');
  });

  it('retire les tirets en début et fin de chaîne', () => {
    expect(sanitizeFileBaseName('--produit--.jpg')).toBe('produit');
  });

  it('gère un nom de fichier sans extension', () => {
    expect(sanitizeFileBaseName('sans-extension')).toBe('sans-extension');
  });
});
