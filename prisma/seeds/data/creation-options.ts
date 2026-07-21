import { cloudinaryUrl } from '../../../src/config/cloudinary.js';

// Les visuels sont servis par Cloudinary. Le dossier "creation-options"
// regroupe les images des tailles, fruits et sauces ; elles y sont déposées
// par le script scripts/upload-creation-images.ts (à lancer une fois).
const img = (basename: string) => cloudinaryUrl(`creation-options/${basename}`);

export const creationSizesData = [
  {
    "name": "moyen",
    "price": 2500,
    "fruits": 1,
    "sauces": 1,
    "cereales": true,
    "image": img('taille_moyenne.png')
  },
  {
    "name": "maxi",
    "price": 3500,
    "fruits": 2,
    "sauces": 2,
    "cereales": true,
    "image": img('taille_maxi.png')
  },
  {
    "name": "Lot de 10 minis fruités",
    "price": 6000,
    "fruits": 2,
    "sauces": 1,
    "cereales": false,
    "image": img('lot_de_10.png')
  }
];

// Fruits et sauces : { nom, image }. L'image correspond à un fichier de la
// racine du projet, téléversé sur Cloudinary sous le même nom de base.
export const creationOptionsData = {
  "fruits": [
    { "nom": "Fraise", "image": img('fraise.png') },
    { "nom": "Mangue", "image": img('mangue.png') },
    { "nom": "Kiwi", "image": img('kiwi.png') },
    { "nom": "Raisin", "image": img('raisin.png') },
    { "nom": "Ananas", "image": img('ananas.png') },
    { "nom": "Pastèque", "image": img('pasteque.png') },
    { "nom": "Fruits de la passion", "image": img('fruit_passion.png') }
  ],
  "sauces": [
    { "nom": "Abricot", "image": img('abricot.png') },
    { "nom": "Cérise", "image": img('cerise.png') },
    { "nom": "Miel", "image": img('miel.png') }
  ],
  "cereales": [] as { nom: string; image: string }[]
};
