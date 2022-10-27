/*
  Warnings:

  - A unique constraint covering the columns `[predioId]` on the table `Terreno` will be added. If there are existing duplicate values, this will fail.
  - Made the column `predioId` on table `Terreno` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Terreno" DROP CONSTRAINT "Terreno_predioId_fkey";

-- AlterTable
CREATE SEQUENCE "construccion_id_seq";
ALTER TABLE "Construccion" ALTER COLUMN "id" SET DEFAULT nextval('construccion_id_seq');
ALTER SEQUENCE "construccion_id_seq" OWNED BY "Construccion"."id";

-- AlterTable
CREATE SEQUENCE "terreno_id_seq";
ALTER TABLE "Terreno" ALTER COLUMN "id" SET DEFAULT nextval('terreno_id_seq'),
ALTER COLUMN "predioId" SET NOT NULL;
ALTER SEQUENCE "terreno_id_seq" OWNED BY "Terreno"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Terreno_predioId_key" ON "Terreno"("predioId");

-- AddForeignKey
ALTER TABLE "Terreno" ADD CONSTRAINT "Terreno_predioId_fkey" FOREIGN KEY ("predioId") REFERENCES "Predio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
