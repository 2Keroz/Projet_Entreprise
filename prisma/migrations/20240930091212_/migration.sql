/*
  Warnings:

  - Added the required column `age` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `civilite` to the `Employe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employe` ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `civilite` ENUM('MR', 'MME') NOT NULL;
