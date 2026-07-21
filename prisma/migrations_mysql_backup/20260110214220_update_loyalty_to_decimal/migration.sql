/*
  Warnings:

  - You are about to alter the column `points` on the `loyalty_history` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `montant` on the `loyalty_history` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `pointsFidelite` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `loyalty_history` MODIFY `points` DECIMAL(65, 30) NOT NULL,
    MODIFY `montant` DECIMAL(65, 30) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `pointsFidelite` DECIMAL(65, 30) NOT NULL DEFAULT 0;
