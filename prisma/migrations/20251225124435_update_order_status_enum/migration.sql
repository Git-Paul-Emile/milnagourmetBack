/*
  Warnings:

  - The values [EN_PREPARATION,LIVRAISON] on the enum `order_status_config_statut` will be removed. If these variants are still used in the database, this will fail.
  - The values [EN_PREPARATION,LIVRAISON] on the enum `order_status_config_statut` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order_status_config` MODIFY `statut` ENUM('RECU', 'LIVREE', 'ANNULEE') NOT NULL;

-- AlterTable
ALTER TABLE `orders` MODIFY `statut` ENUM('RECU', 'LIVREE', 'ANNULEE') NOT NULL DEFAULT 'RECU';

-- CreateTable
CREATE TABLE `avatar_toast` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
