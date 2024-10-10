/*
  Warnings:

  - A unique constraint covering the columns `[mail]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Employe_mail_key` ON `Employe`(`mail`);
