import { cloudinaryUrl } from '../../../src/config/cloudinary.js';

const YOGURT_NATURE_IMAGE = cloudinaryUrl('produits/yogurt-nature.jpg');
const YOGURT_COCO_IMAGE = cloudinaryUrl('produits/liquide-coco.png');
const YOGURT_VANILLE_IMAGE = cloudinaryUrl('produits/liquide-vanille.png');
const YOGURT_BISSAP_IMAGE = cloudinaryUrl('produits/liquide-bissap.png');

export const productsData = [
  {
    "id": "cremeux-nature",
    "name": "Gourmet Nature",
    "category": "cremeux",
    "price": 450,
    "description": "Yaourt crémeux nature, préparé avec des ingrédients frais et naturels. Parfait pour un petit-déjeuner sain ou une collation légère.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "cremeux-simple",
    "name": "Gourmet Simple",
    "category": "cremeux",
    "price": 600,
    "description": "Yaourt crémeux avec une pointe de douceur, idéal pour accompagner vos moments gourmands.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "cremeux-cereales",
    "name": "Gourmet Céréales",
    "category": "cremeux",
    "price": 1000,
    "description": "Yaourt crémeux agrémenté de délicieuses céréales croquantes pour plus de texture et de saveur.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true
  },
  {
    "id": "liquide-vanille",
    "name": "Gourmet Vanille",
    "category": "liquide",
    "price": 2000,
    "description": "Yaourt liquide onctueux parfumé à la vanille naturelle. Une explosion de saveurs douces et crémeuses.",
    "image": YOGURT_VANILLE_IMAGE,
    "available": true
  },
  {
    "id": "liquide-bissap",
    "name": "Gourmet Bissap",
    "category": "liquide",
    "price": 2500,
    "description": "Yaourt liquide au bissap (hibiscus), une fusion unique entre tradition sénégalaise et gourmandise moderne.",
    "image": YOGURT_BISSAP_IMAGE,
    "available": true,
    "archived": false
  },
  {
    "id": "liquide-couscous",
    "name": "Gourmet Couscous",
    "category": "liquide",
    "price": 2500,
    "description": "Yaourt liquide inspiré des saveurs traditionnelles du couscous, pour une expérience gustative authentique.",
    "image": YOGURT_COCO_IMAGE,
    "available": true
  },
  {
    "id": "liquide-coco",
    "name": "Gourmet Coco",
    "category": "liquide",
    "price": 2500,
    "description": "Yaourt liquide à la noix de coco fraîche, transportez-vous sous les tropiques à chaque gorgée.",
    "image": YOGURT_COCO_IMAGE,
    "available": true
  },
  {
    "id": "cremeux-lot10-simple",
    "name": "Lot de 10 miniscrémeux simple",
    "category": "cremeux",
    "price": 3000,
    "description": "10 miniscrémeux nature de 100g, parfaits pour partager ou pour vos collations.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true
  },
  {
    "id": "cremeux-lot10-mixe",
    "name": "Lot de 10 miniscrémeux mixe",
    "category": "cremeux",
    "price": 4500,
    "description": "10 miniscrémeux de 100g aux saveurs variées, à assortir selon vos envies.",
    "image": YOGURT_NATURE_IMAGE,
    "available": true
  }
];
