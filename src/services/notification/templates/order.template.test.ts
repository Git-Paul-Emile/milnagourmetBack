import { describe, it, expect } from 'vitest';
import type { CommandeWithRelations } from '../../../repository/order.repository.js';
import {
  formaterDetailCommande,
  gabaritNouvelleCommande,
  gabaritStatutCommande,
} from './order.template.js';

/**
 * Le gabarit produit le contenu envoyé au vendeur et au client. Une
 * erreur ici se traduit par un message incompréhensible ou incomplet —
 * et donc une commande mal préparée.
 */

const commandeComplete = {
  id: 1,
  numeroCommande: 'CMD-0001',
  nomClient: 'Awa Nzeng',
  telephoneClient: '+241066000000',
  montantTotal: 15000,
  fraisLivraison: 2000,
  elements: [
    { quantite: 2, prix: 3500, produit: { nom: 'Yaourt crémeux vanille' } },
    { quantite: 1, prix: 4000, produit: { nom: 'Lot de 10' } },
  ],
  creationsPersonnalisees: [
    {
      quantite: 1,
      prix: 4000,
      taille: { nom: 'Taille maxi' },
      fruits: [{ fruit: { nom: 'Mangue' } }, { fruit: { nom: 'Fraise' } }],
      sauces: [{ sauce: { nom: 'Miel' } }],
      cereales: [],
    },
  ],
  utilisateur: null,
  // Double cast : le gabarit ne lit qu'une poignée de champs, recréer
  // l'intégralité du type Prisma (une centaine de propriétés imbriquées)
  // n'apporterait rien au test. `as unknown as T` conserve le type objet,
  // là où `as never` interdirait tout usage du spread ci-dessous.
} as unknown as CommandeWithRelations;

describe('formaterDetailCommande', () => {
  it('liste les produits avec quantité et prix', () => {
    const detail = formaterDetailCommande(commandeComplete);

    expect(detail).toContain('Yaourt crémeux vanille x2 (3500 FCFA)');
    expect(detail).toContain('Lot de 10 x1 (4000 FCFA)');
  });

  it('détaille les ingrédients des créations personnalisées', () => {
    const detail = formaterDetailCommande(commandeComplete);

    expect(detail).toContain('Taille maxi x1');
    expect(detail).toContain('Fruits : Mangue, Fraise');
    expect(detail).toContain('Sauces : Miel');
    // Aucune céréale sélectionnée : la ligne ne doit pas apparaître.
    expect(detail).not.toContain('Céréales :');
  });

  it('rappelle les frais de livraison, le total et le mode de règlement', () => {
    const detail = formaterDetailCommande(commandeComplete);

    expect(detail).toContain('Frais de livraison : 2000 FCFA');
    expect(detail).toContain('Montant total : 15000 FCFA');
    expect(detail).toContain('paiement à la livraison');
  });

  it('reste lisible pour une commande sans aucun article', () => {
    const vide = {
      ...commandeComplete,
      elements: [],
      creationsPersonnalisees: [],
    } as unknown as CommandeWithRelations;

    expect(() => formaterDetailCommande(vide)).not.toThrow();
    expect(formaterDetailCommande(vide)).toContain('Montant total');
  });
});

describe('gabaritNouvelleCommande', () => {
  it('produit un sujet, un texte et un HTML cohérents', () => {
    const contenu = gabaritNouvelleCommande(commandeComplete);

    expect(contenu.sujet).toContain('CMD-0001');
    expect(contenu.sujet).toContain('Awa Nzeng');
    expect(contenu.texte).toContain('+241066000000');
    expect(contenu.html).toContain('<!doctype html>');
  });

  it("échappe le HTML des données saisies par l'utilisateur", () => {
    const malveillante = {
      ...commandeComplete,
      nomClient: '<script>alert(1)</script>',
    } as unknown as CommandeWithRelations;

    const contenu = gabaritNouvelleCommande(malveillante);

    // La balise ne doit jamais se retrouver interprétable dans l'email.
    expect(contenu.html).not.toContain('<script>');
    expect(contenu.html).toContain('&lt;script&gt;');
  });
});

describe('gabaritStatutCommande', () => {
  it('annonce la livraison et le montant réglé', () => {
    const contenu = gabaritStatutCommande(commandeComplete, 'LIVREE');

    expect(contenu.sujet).toMatch(/livrée/i);
    expect(contenu.texte).toContain('15000 FCFA');
  });

  it("précise qu'aucun montant n'est facturé en cas d'annulation", () => {
    const contenu = gabaritStatutCommande(commandeComplete, 'ANNULEE');

    expect(contenu.sujet).toMatch(/annulée/i);
    expect(contenu.texte).toMatch(/aucun montant/i);
  });
});
