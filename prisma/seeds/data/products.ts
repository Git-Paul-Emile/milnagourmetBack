import { cloudinaryUrl } from '../../../src/config/cloudinary.js';

const YOGURT_NATURE_IMAGE = cloudinaryUrl('produits/yogurt-nature.jpg');
const YOGURT_COCO_IMAGE = cloudinaryUrl('produits/liquide-coco.png');
const YOGURT_VANILLE_IMAGE = cloudinaryUrl('produits/liquide-vanille.png');
const YOGURT_BISSAP_IMAGE = cloudinaryUrl('produits/liquide-bissap.png');

export const productsData = [
  {
    "id": "cremeux-lot10-simple",
    "name": "Lot de 10 mini gourmets crémeux simples",
    "category": "cremeux",
    "price": 3000,
    "description": "10 mini gourmets crémeux simples de 100g chacun, parfaits pour partager ou pour vos collations.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "cremeux-nature",
    "name": "Gourmet crémeux nature",
    "category": "cremeux",
    "price": 450,
    "description": "Yaourt crémeux nature 200g, préparé avec des ingrédients frais et naturels. Parfait pour un petit-déjeuner sain ou une collation légère.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "cremeux-simple",
    "name": "Gourmet crémeux simple",
    "category": "cremeux",
    "price": 600,
    "description": "Yaourt crémeux simple 200g avec une pointe de douceur, idéal pour accompagner vos moments gourmands.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "cremeux-cereales",
    "name": "Gourmet crémeux aux céréales",
    "category": "cremeux",
    "price": 1000,
    "description": "Yaourt crémeux 200g agrémenté de délicieuses céréales croquantes pour plus de texture et de saveur.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "cremeux-maxi",
    "name": "Gourmet crémeux maxi",
    "category": "cremeux",
    "price": 1500,
    "description": "Yaourt crémeux maxi format généreux (250g/300g), pour les grands amateurs de douceur onctueuse.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "liquide-vanille",
    "name": "Gourmet liquide vanille",
    "category": "liquide",
    "price": 2000,
    "description": "Yaourt liquide onctueux 1L parfumé à la vanille naturelle. Une explosion de saveurs douces et crémeuses.",
    "image": YOGURT_VANILLE_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "liquide-couscous",
    "name": "Gourmet liquide couscous",
    "category": "liquide",
    "price": 2500,
    "description": "Yaourt liquide 1L inspiré des saveurs traditionnelles du couscous, pour une expérience gustative authentique.",
    "image": YOGURT_COCO_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "liquide-coco",
    "name": "Gourmet liquide coco",
    "category": "liquide",
    "price": 2500,
    "description": "Yaourt liquide 1L à la noix de coco fraîche, transportez-vous sous les tropiques à chaque gorgée.",
    "image": YOGURT_COCO_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "liquide-bissap",
    "name": "Gourmet liquide bissap",
    "category": "liquide",
    "price": 2500,
    "description": "Yaourt liquide 1L au bissap (hibiscus), une fusion unique entre tradition gabonaise et gourmandise moderne.",
    "image": YOGURT_BISSAP_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "liquide-mil",
    "name": "Gourmet liquide mil",
    "category": "liquide",
    "price": 2500,
    "description": "Yaourt liquide traditionnel 1L au mil savoureux, gourmand et rafraîchissant.",
    "image": YOGURT_COCO_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "creation-lot10-mixe",
    "name": "Lot de 10 mini gourmets crémeux mixés",
    "category": "creation",
    "price": 4500,
    "description": "10 mini gourmets crémeux de 100g aux saveurs variées, à assortir selon vos envies de création.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true,
    "archived": false
  }
];
