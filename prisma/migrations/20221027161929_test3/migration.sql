/*
  Warnings:

  - You are about to alter the column `NIT` on the `Propietario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Propietario" ALTER COLUMN "NIT" SET DATA TYPE INTEGER;
