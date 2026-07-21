-- Services spéciaux (Panier gourmand, Boîte pancake) — prix sur devis
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

CREATE TABLE "service_components" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_components_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "special_services_code_key" ON "special_services"("code");

ALTER TABLE "special_services" ADD CONSTRAINT "special_services_produitId_fkey"
    FOREIGN KEY ("produitId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "service_components" ADD CONSTRAINT "service_components_serviceId_fkey"
    FOREIGN KEY ("serviceId") REFERENCES "special_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
