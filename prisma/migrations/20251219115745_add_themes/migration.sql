-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telephone` VARCHAR(191) NOT NULL,
    `nomComplet` VARCHAR(191) NOT NULL,
    `blocked` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(191) NOT NULL,
    `tokenVersion` INTEGER NOT NULL DEFAULT 0,
    `role` VARCHAR(191) NULL DEFAULT 'USER',
    `zoneLivraisonId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_telephone_key`(`telephone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER NOT NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `panierId` INTEGER NOT NULL,
    `produitId` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `prix` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_creations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `panierId` INTEGER NOT NULL,
    `tailleId` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL DEFAULT 1,
    `prix` INTEGER NOT NULL,
    `fruits` VARCHAR(191) NULL,
    `sauces` VARCHAR(191) NULL,
    `cereales` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `categorie` ENUM('CREMEUX', 'LIQUIDE', 'CREATION') NOT NULL,
    `categorieId` INTEGER NULL,
    `prix` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categorieId` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `libelleFr` VARCHAR(191) NOT NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifieLe` DATETIME(3) NOT NULL,

    UNIQUE INDEX `category_translations_categorieId_code_key`(`categorieId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroCommande` VARCHAR(191) NOT NULL,
    `utilisateurId` INTEGER NULL,
    `nomClient` VARCHAR(191) NOT NULL,
    `telephoneClient` VARCHAR(191) NOT NULL,
    `statut` ENUM('RECU', 'EN_PREPARATION', 'LIVRAISON', 'LIVREE') NOT NULL DEFAULT 'RECU',
    `montantTotal` INTEGER NOT NULL,
    `fraisLivraison` INTEGER NOT NULL DEFAULT 0,
    `notes` VARCHAR(191) NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifieLe` DATETIME(3) NOT NULL,
    `livreurId` INTEGER NULL,

    UNIQUE INDEX `orders_numeroCommande_key`(`numeroCommande`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_status_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statut` ENUM('RECU', 'EN_PREPARATION', 'LIVRAISON', 'LIVREE') NOT NULL,
    `libelleFr` VARCHAR(191) NOT NULL,
    `couleurBg` VARCHAR(191) NOT NULL,
    `couleurText` VARCHAR(191) NOT NULL,
    `icone` VARCHAR(191) NULL,
    `ordre` INTEGER NOT NULL DEFAULT 0,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifieLe` DATETIME(3) NOT NULL,

    UNIQUE INDEX `order_status_config_statut_key`(`statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commandeId` INTEGER NOT NULL,
    `produitId` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `prix` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custom_creations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commandeId` INTEGER NOT NULL,
    `tailleId` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL DEFAULT 1,
    `prix` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `creation_fruits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creationPersonnaliseeId` INTEGER NOT NULL,
    `fruitId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `creation_sauces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creationPersonnaliseeId` INTEGER NOT NULL,
    `sauceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `creation_cereales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creationPersonnaliseeId` INTEGER NOT NULL,
    `cerealeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fruits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `ordreAffichage` INTEGER NOT NULL DEFAULT 0,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `fruits_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sauces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `ordreAffichage` INTEGER NOT NULL DEFAULT 0,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sauces_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cereales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `ordreAffichage` INTEGER NOT NULL DEFAULT 0,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cereales_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `creation_sizes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prix` INTEGER NOT NULL,
    `maxFruits` INTEGER NOT NULL,
    `maxSauces` INTEGER NOT NULL,
    `cerealesAutorise` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `ordreAffichage` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `creation_sizes_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `size_translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tailleId` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `libelleFr` VARCHAR(191) NOT NULL,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifieLe` DATETIME(3) NOT NULL,

    UNIQUE INDEX `size_translations_tailleId_code_key`(`tailleId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_zones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `fraisLivraison` INTEGER NOT NULL,
    `tempsEstime` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_persons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomComplet` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `vehicule` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `creeLe` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `lieu` VARCHAR(191) NOT NULL,
    `note` INTEGER NOT NULL,
    `commentaire` TEXT NOT NULL,
    `avatar` LONGTEXT NULL,
    `date` DATETIME(3) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomEntreprise` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opening_hours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contactId` INTEGER NOT NULL,
    `jour` VARCHAR(191) NOT NULL,
    `ouverture` VARCHAR(191) NULL,
    `fermeture` VARCHAR(191) NULL,
    `ferme` BOOLEAN NOT NULL DEFAULT false,
    `ordre` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `opening_hours_contactId_jour_key`(`contactId`, `jour`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `social_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plateforme` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `modifieLe` DATETIME(3) NOT NULL,

    UNIQUE INDEX `social_media_plateforme_key`(`plateforme`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logo` VARCHAR(191) NOT NULL,
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hero_section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `banner` VARCHAR(191) NULL,
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hero_features` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heroId` INTEGER NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `ordre` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catalog_section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `titreCreation` VARCHAR(191) NOT NULL,
    `descriptionCreation` TEXT NOT NULL,
    `boutonCreation` VARCHAR(191) NOT NULL,
    `imageCreation` VARCHAR(191) NULL,
    `messageVide` VARCHAR(191) NOT NULL,
    `messageVideSecondaire` VARCHAR(191) NOT NULL,
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `navigation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `ordre` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `modifieLe` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `themes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `lightColors` JSON NOT NULL,
    `darkColors` JSON NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `themes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_zoneLivraisonId_fkey` FOREIGN KEY (`zoneLivraisonId`) REFERENCES `delivery_zones`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_panierId_fkey` FOREIGN KEY (`panierId`) REFERENCES `carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_produitId_fkey` FOREIGN KEY (`produitId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_creations` ADD CONSTRAINT `cart_creations_panierId_fkey` FOREIGN KEY (`panierId`) REFERENCES `carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_creations` ADD CONSTRAINT `cart_creations_tailleId_fkey` FOREIGN KEY (`tailleId`) REFERENCES `creation_sizes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_translations` ADD CONSTRAINT `category_translations_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `product_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_livreurId_fkey` FOREIGN KEY (`livreurId`) REFERENCES `delivery_persons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_commandeId_fkey` FOREIGN KEY (`commandeId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_produitId_fkey` FOREIGN KEY (`produitId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custom_creations` ADD CONSTRAINT `custom_creations_commandeId_fkey` FOREIGN KEY (`commandeId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custom_creations` ADD CONSTRAINT `custom_creations_tailleId_fkey` FOREIGN KEY (`tailleId`) REFERENCES `creation_sizes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creation_fruits` ADD CONSTRAINT `creation_fruits_creationPersonnaliseeId_fkey` FOREIGN KEY (`creationPersonnaliseeId`) REFERENCES `custom_creations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creation_fruits` ADD CONSTRAINT `creation_fruits_fruitId_fkey` FOREIGN KEY (`fruitId`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creation_sauces` ADD CONSTRAINT `creation_sauces_creationPersonnaliseeId_fkey` FOREIGN KEY (`creationPersonnaliseeId`) REFERENCES `custom_creations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creation_sauces` ADD CONSTRAINT `creation_sauces_sauceId_fkey` FOREIGN KEY (`sauceId`) REFERENCES `sauces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creation_cereales` ADD CONSTRAINT `creation_cereales_creationPersonnaliseeId_fkey` FOREIGN KEY (`creationPersonnaliseeId`) REFERENCES `custom_creations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creation_cereales` ADD CONSTRAINT `creation_cereales_cerealeId_fkey` FOREIGN KEY (`cerealeId`) REFERENCES `cereales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `size_translations` ADD CONSTRAINT `size_translations_tailleId_fkey` FOREIGN KEY (`tailleId`) REFERENCES `creation_sizes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opening_hours` ADD CONSTRAINT `opening_hours_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hero_features` ADD CONSTRAINT `hero_features_heroId_fkey` FOREIGN KEY (`heroId`) REFERENCES `hero_section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
