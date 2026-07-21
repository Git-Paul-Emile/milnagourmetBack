-- CreateEnum
CREATE TYPE "CategorieProduit" AS ENUM ('CREMEUX', 'LIQUIDE', 'CREATION');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('RECU', 'LIVREE', 'ANNULEE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "telephone" TEXT NOT NULL,
    "nomComplet" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT DEFAULT 'USER',
    "zoneLivraisonId" INTEGER,
    "pointsFidelite" DECIMAL(65,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" SERIAL NOT NULL,
    "panierId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix" INTEGER NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_creations" (
    "id" SERIAL NOT NULL,
    "panierId" INTEGER NOT NULL,
    "tailleId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "prix" INTEGER NOT NULL,
    "fruits" TEXT,
    "sauces" TEXT,
    "cereales" TEXT,

    CONSTRAINT "cart_creations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" "CategorieProduit" NOT NULL,
    "categorieId" INTEGER,
    "prix" INTEGER NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_services" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "minElements" INTEGER NOT NULL DEFAULT 1,
    "produitId" INTEGER,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "special_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_components" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_translations" (
    "id" SERIAL NOT NULL,
    "categorieId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "libelleFr" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "numeroCommande" TEXT NOT NULL,
    "utilisateurId" INTEGER,
    "nomClient" TEXT NOT NULL,
    "telephoneClient" TEXT NOT NULL,
    "statut" "StatutCommande" NOT NULL DEFAULT 'RECU',
    "montantTotal" INTEGER NOT NULL,
    "fraisLivraison" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,
    "livreurId" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_config" (
    "id" SERIAL NOT NULL,
    "statut" "StatutCommande" NOT NULL,
    "libelleFr" TEXT NOT NULL,
    "couleurBg" TEXT NOT NULL,
    "couleurText" TEXT NOT NULL,
    "icone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_status_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_creations" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "tailleId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "prix" INTEGER NOT NULL,

    CONSTRAINT "custom_creations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creation_fruits" (
    "id" SERIAL NOT NULL,
    "creationPersonnaliseeId" INTEGER NOT NULL,
    "fruitId" INTEGER NOT NULL,

    CONSTRAINT "creation_fruits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creation_sauces" (
    "id" SERIAL NOT NULL,
    "creationPersonnaliseeId" INTEGER NOT NULL,
    "sauceId" INTEGER NOT NULL,

    CONSTRAINT "creation_sauces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creation_cereales" (
    "id" SERIAL NOT NULL,
    "creationPersonnaliseeId" INTEGER NOT NULL,
    "cerealeId" INTEGER NOT NULL,

    CONSTRAINT "creation_cereales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fruits" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "image" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "ordreAffichage" INTEGER NOT NULL DEFAULT 0,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fruits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sauces" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "image" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "ordreAffichage" INTEGER NOT NULL DEFAULT 0,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sauces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cereales" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "image" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "ordreAffichage" INTEGER NOT NULL DEFAULT 0,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cereales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creation_sizes" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prix" INTEGER NOT NULL,
    "maxFruits" INTEGER NOT NULL,
    "maxSauces" INTEGER NOT NULL,
    "cerealesAutorise" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ordreAffichage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "creation_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "size_translations" (
    "id" SERIAL NOT NULL,
    "tailleId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "libelleFr" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "size_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_zones" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "fraisLivraison" INTEGER NOT NULL,
    "tempsEstime" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_persons" (
    "id" SERIAL NOT NULL,
    "nomComplet" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "vehicule" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT NOT NULL,
    "avatar" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "nomEntreprise" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opening_hours" (
    "id" SERIAL NOT NULL,
    "contactId" INTEGER NOT NULL,
    "jour" TEXT NOT NULL,
    "ouverture" TEXT,
    "fermeture" TEXT,
    "ferme" BOOLEAN NOT NULL DEFAULT false,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "opening_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media" (
    "id" SERIAL NOT NULL,
    "plateforme" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branding" (
    "id" SERIAL NOT NULL,
    "logo" TEXT NOT NULL,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avatar_toast" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avatar_toast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_section" (
    "id" SERIAL NOT NULL,
    "banner" TEXT,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_features" (
    "id" SERIAL NOT NULL,
    "heroId" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hero_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_section" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "titreCreation" TEXT NOT NULL,
    "descriptionCreation" TEXT NOT NULL,
    "boutonCreation" TEXT NOT NULL,
    "imageCreation" TEXT,
    "messageVide" TEXT NOT NULL,
    "messageVideSecondaire" TEXT NOT NULL,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_history" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "points" DECIMAL(65,2) NOT NULL,
    "montant" DECIMAL(65,2),
    "description" TEXT NOT NULL,
    "commandeId" INTEGER,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telephone_key" ON "users"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "special_services_code_key" ON "special_services"("code");

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_categorieId_code_key" ON "category_translations"("categorieId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_numeroCommande_key" ON "orders"("numeroCommande");

-- CreateIndex
CREATE UNIQUE INDEX "order_status_config_statut_key" ON "order_status_config"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "fruits_nom_key" ON "fruits"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "sauces_nom_key" ON "sauces"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "cereales_nom_key" ON "cereales"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "creation_sizes_nom_key" ON "creation_sizes"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "size_translations_tailleId_code_key" ON "size_translations"("tailleId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "opening_hours_contactId_jour_key" ON "opening_hours"("contactId", "jour");

-- CreateIndex
CREATE UNIQUE INDEX "social_media_plateforme_key" ON "social_media"("plateforme");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_zoneLivraisonId_fkey" FOREIGN KEY ("zoneLivraisonId") REFERENCES "delivery_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_panierId_fkey" FOREIGN KEY ("panierId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_creations" ADD CONSTRAINT "cart_creations_panierId_fkey" FOREIGN KEY ("panierId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_creations" ADD CONSTRAINT "cart_creations_tailleId_fkey" FOREIGN KEY ("tailleId") REFERENCES "creation_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "special_services" ADD CONSTRAINT "special_services_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_components" ADD CONSTRAINT "service_components_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "special_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_livreurId_fkey" FOREIGN KEY ("livreurId") REFERENCES "delivery_persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_creations" ADD CONSTRAINT "custom_creations_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_creations" ADD CONSTRAINT "custom_creations_tailleId_fkey" FOREIGN KEY ("tailleId") REFERENCES "creation_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creation_fruits" ADD CONSTRAINT "creation_fruits_creationPersonnaliseeId_fkey" FOREIGN KEY ("creationPersonnaliseeId") REFERENCES "custom_creations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creation_fruits" ADD CONSTRAINT "creation_fruits_fruitId_fkey" FOREIGN KEY ("fruitId") REFERENCES "fruits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creation_sauces" ADD CONSTRAINT "creation_sauces_creationPersonnaliseeId_fkey" FOREIGN KEY ("creationPersonnaliseeId") REFERENCES "custom_creations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creation_sauces" ADD CONSTRAINT "creation_sauces_sauceId_fkey" FOREIGN KEY ("sauceId") REFERENCES "sauces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creation_cereales" ADD CONSTRAINT "creation_cereales_creationPersonnaliseeId_fkey" FOREIGN KEY ("creationPersonnaliseeId") REFERENCES "custom_creations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creation_cereales" ADD CONSTRAINT "creation_cereales_cerealeId_fkey" FOREIGN KEY ("cerealeId") REFERENCES "cereales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "size_translations" ADD CONSTRAINT "size_translations_tailleId_fkey" FOREIGN KEY ("tailleId") REFERENCES "creation_sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_features" ADD CONSTRAINT "hero_features_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "hero_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_history" ADD CONSTRAINT "loyalty_history_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_history" ADD CONSTRAINT "loyalty_history_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
