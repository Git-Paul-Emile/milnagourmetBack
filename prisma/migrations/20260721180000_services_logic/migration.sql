-- Logique métier des services spéciaux :
--   type de service, prix de base, éléments par défaut et quantités plancher.
ALTER TABLE "special_services"
  ADD COLUMN "typeService" TEXT NOT NULL DEFAULT 'PANIER_FIXE',
  ADD COLUMN "prixBase" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "service_components"
  ADD COLUMN "parDefaut" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "quantiteDefaut" INTEGER NOT NULL DEFAULT 0;
