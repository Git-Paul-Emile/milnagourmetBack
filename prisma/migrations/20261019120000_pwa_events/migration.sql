-- Migration : suivi des scans de QR code et des installations PWA.
-- Table nouvelle et indépendante : aucune donnée existante n'est touchée.

CREATE TYPE "TypeEvenementPwa" AS ENUM ('SCAN', 'INSTALLATION');

CREATE TYPE "SourcePwa" AS ENUM ('QRCODE', 'DIRECT');

CREATE TABLE "pwa_events" (
    "id" SERIAL NOT NULL,
    "appareilId" TEXT NOT NULL,
    "type" "TypeEvenementPwa" NOT NULL,
    "source" "SourcePwa" NOT NULL,
    "plateforme" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pwa_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pwa_events_appareilId_type_key" ON "pwa_events"("appareilId", "type");
