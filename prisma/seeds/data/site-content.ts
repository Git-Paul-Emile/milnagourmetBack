import { cloudinaryUrl } from '../../../src/config/cloudinary.js';

const DEFAULT_BANNER = cloudinaryUrl('banners/hero-banner.jpg');
const DEFAULT_CREATION_IMAGE = cloudinaryUrl('creation/yogurt-creation.jpg');
const DEFAULT_LOGO = cloudinaryUrl('logos/milna-logo.png');
const DEFAULT_AVATAR_TOAST = cloudinaryUrl('avatarToast/milna-owner.jpg');

export const heroData = {
  "banner": DEFAULT_BANNER,
  "features": [
    {
      "title": "100% Naturel",
      "description": "Ingrédients frais et naturels"
    },
    {
      "title": "Livraison Rapide",
      "description": "Commande via WhatsApp"
    },
    {
      "title": "Création Personnalisée",
      "description": "Composez votre gourmet"
    }
  ]
};

export const catalogData = {
  "title": "Notre Catalogue",
  "description": "Découvrez notre sélection de yaourts gourmets, préparés avec amour et des ingrédients de qualité",
  "creationTitle": "Création Personnalisée",
  "creationDescription": "Composez votre yaourt gourmet selon vos envies ! Choisissez votre taille, vos fruits, vos sauces et vos céréales.",
  "creationButtonText": "Créer mon Gourmet",
  "creationImage": DEFAULT_CREATION_IMAGE,
  "emptyMessage": "Aucun produit trouvé",
  "emptySubMessage": "Essayez une autre catégorie ou revenez plus tard"
};

export const navigationData = [
  { "name": "Accueil", "href": "#home", "active": true, "order": 1 },
  { "name": "Catalogue", "href": "#catalog", "active": true, "order": 2 },
  { "name": "Témoignages", "href": "#testimonials", "active": true, "order": 3 },
  { "name": "Contact", "href": "#contact", "active": true, "order": 4 }
];

export const brandingData = {
  "logo": DEFAULT_LOGO
};

export const avatarToastData = {
  "image": DEFAULT_AVATAR_TOAST
};

export const bannerData = DEFAULT_BANNER;
