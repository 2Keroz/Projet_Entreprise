/*
  Warnings:

  - You are about to drop the column `civilite` on the `employe` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `entreprise` table. All the data in the column will be lost.
  - You are about to drop the column `employeId` on the `ordinateur` table. All the data in the column will be lost.
  - You are about to drop the column `marque` on the `ordinateur` table. All the data in the column will be lost.
  - You are about to drop the column `modele` on the `ordinateur` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ordinateurId]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adresseMac]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mail` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adresseMac` to the `Ordinateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Ordinateur` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ordinateur` DROP FOREIGN KEY `Ordinateur_employeId_fkey`;

-- AlterTable
ALTER TABLE `employe` DROP COLUMN `civilite`,
    ADD COLUMN `mail` VARCHAR(191) NOT NULL,
    ADD COLUMN `ordinateurId` INTEGER NULL;

-- AlterTable
ALTER TABLE `entreprise` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `ordinateur` DROP COLUMN `employeId`,
    DROP COLUMN `marque`,
    DROP COLUMN `modele`,
    ADD COLUMN `adresseMac` VARCHAR(191) NOT NULL,
    ADD COLUMN `designation` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employe_ordinateurId_key` ON `Employe`(`ordinateurId`);

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_adresseMac_key` ON `Ordinateur`(`adresseMac`);

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_ordinateurId_fkey` FOREIGN KEY (`ordinateurId`) REFERENCES `Ordinateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
