/*
  Warnings:

  - You are about to drop the column `company_name` on the `entreprise` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `entreprise` table. All the data in the column will be lost.
  - Added the required column `motDePasse` to the `Entreprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raisonSociale` to the `Entreprise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `entreprise` DROP COLUMN `company_name`,
    DROP COLUMN `password`,
    ADD COLUMN `motDePasse` VARCHAR(191) NOT NULL,
    ADD COLUMN `raisonSociale` VARCHAR(191) NOT NULL,
    MODIFY `siret` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Employe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `motDePasse` VARCHAR(191) NOT NULL,
    `entrepriseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ordinateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marque` VARCHAR(191) NOT NULL,
    `modele` VARCHAR(191) NOT NULL,
    `entrepriseId` INTEGER NOT NULL,
    `employeId` INTEGER NULL,

    UNIQUE INDEX `Ordinateur_employeId_key`(`employeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
