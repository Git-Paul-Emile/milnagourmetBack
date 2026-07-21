-- Couvertures multiples (rotation automatique) pour les cartes services.
ALTER TABLE "special_services" ADD COLUMN "covers" TEXT[] NOT NULL DEFAULT '{}';
