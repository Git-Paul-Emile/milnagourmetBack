-- Ajout d'une image (facultative) aux tailles de création.
-- La table est mappée sur "creation_sizes" (voir @@map dans schema.prisma).
ALTER TABLE "creation_sizes" ADD COLUMN "image" TEXT;
