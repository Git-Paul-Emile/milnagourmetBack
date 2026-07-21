-- AlterTable
ALTER TABLE `users` ADD COLUMN `pointsFidelite` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `loyalty_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL,
    `montant` INTEGER NULL,
    `description` VARCHAR(191) NOT NULL,
    `commandeId` INTEGER NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `loyalty_history` ADD CONSTRAINT `loyalty_history_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loyalty_history` ADD CONSTRAINT `loyalty_history_commandeId_fkey` FOREIGN KEY (`commandeId`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
