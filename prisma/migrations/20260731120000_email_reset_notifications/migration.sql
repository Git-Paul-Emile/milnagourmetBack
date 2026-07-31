-- Migration : email utilisateur, jetons de réinitialisation, traçabilité des notifications
--
-- Toutes les colonnes ajoutées sont NULLABLE ou pourvues d'un DEFAULT :
-- la migration s'applique donc sans interruption de service et sans
-- rétro-remplissage sur les lignes existantes.

-- 1) Email facultatif sur les comptes ------------------------------------
ALTER TABLE "users" ADD COLUMN "email" TEXT;

-- Index unique partiel : PostgreSQL n'inclut pas les NULL dans un index
-- unique, plusieurs comptes peuvent donc rester sans email.
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- 2) Jetons de réinitialisation de mot de passe ---------------------------
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expireLe" TIMESTAMP(3) NOT NULL,
    "utiliseLe" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "password_reset_tokens_tokenHash_key" ON "password_reset_tokens"("tokenHash");
CREATE INDEX "password_reset_tokens_utilisateurId_idx" ON "password_reset_tokens"("utilisateurId");
CREATE INDEX "password_reset_tokens_expireLe_idx" ON "password_reset_tokens"("expireLe");

ALTER TABLE "password_reset_tokens"
    ADD CONSTRAINT "password_reset_tokens_utilisateurId_fkey"
    FOREIGN KEY ("utilisateurId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- 3) Traçabilité des notifications de commande ---------------------------
ALTER TABLE "orders" ADD COLUMN "emailClient" TEXT;
ALTER TABLE "orders" ADD COLUMN "notificationEnvoyee" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "orders" ADD COLUMN "notificationCanal" TEXT;
ALTER TABLE "orders" ADD COLUMN "notificationTentatives" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN "notificationErreur" TEXT;
ALTER TABLE "orders" ADD COLUMN "notificationEnvoyeeLe" TIMESTAMP(3);
