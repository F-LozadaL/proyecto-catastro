-- DropForeignKey
ALTER TABLE "Terreno" DROP CONSTRAINT "Terreno_predioId_fkey";

-- AlterTable
ALTER TABLE "Terreno" ALTER COLUMN "predioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Terreno" ADD CONSTRAINT "Terreno_predioId_fkey" FOREIGN KEY ("predioId") REFERENCES "Predio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
