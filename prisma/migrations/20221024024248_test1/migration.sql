-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('NATURAL', 'JURIDICA');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CEDULA_DE_CIUDADANIA', 'CEDULA_DE_EXTRANJERIA', 'NUMERO_DE_IDENTIFICACION_PERSONAL', 'NUMERO_DE_IDENTIFICACION_TRIBUTARIA', 'TARJETA_DE_IDENTIDAD', 'PASAPORTE');

-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('INDUSTRIAL', 'COMERCIAL', 'RESIDENCIAL');

-- CreateEnum
CREATE TYPE "TerritoryType" AS ENUM ('URBANO', 'RURAL');

-- CreateTable
CREATE TABLE "Predio" (
    "id" SERIAL NOT NULL,
    "appraise" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "Predio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propietario" (
    "id" INTEGER NOT NULL,
    "id_type" "DocumentType" NOT NULL,
    "names" TEXT NOT NULL,
    "lastnames" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "person_type" "PersonType" NOT NULL,
    "NIT" BIGINT,
    "business_name" TEXT,
    "email" TEXT,

    CONSTRAINT "Propietario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Construccion" (
    "id" INTEGER NOT NULL,
    "area_m2" DOUBLE PRECISION NOT NULL,
    "type" "BuildingType" NOT NULL,
    "floors" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "predioId" INTEGER,

    CONSTRAINT "Construccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terreno" (
    "id" INTEGER NOT NULL,
    "area_m2" DOUBLE PRECISION NOT NULL,
    "value" INTEGER NOT NULL,
    "water" BOOLEAN NOT NULL,
    "territory_type" "TerritoryType" NOT NULL,
    "Buildings" BOOLEAN NOT NULL,
    "predioId" INTEGER,

    CONSTRAINT "Terreno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PredioToPropietario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Predio_appraise_idx" ON "Predio"("appraise");

-- CreateIndex
CREATE UNIQUE INDEX "Propietario_phone_key" ON "Propietario"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Propietario_email_key" ON "Propietario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PredioToPropietario_AB_unique" ON "_PredioToPropietario"("A", "B");

-- CreateIndex
CREATE INDEX "_PredioToPropietario_B_index" ON "_PredioToPropietario"("B");

-- AddForeignKey
ALTER TABLE "Construccion" ADD CONSTRAINT "Construccion_predioId_fkey" FOREIGN KEY ("predioId") REFERENCES "Predio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Terreno" ADD CONSTRAINT "Terreno_predioId_fkey" FOREIGN KEY ("predioId") REFERENCES "Predio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PredioToPropietario" ADD CONSTRAINT "_PredioToPropietario_A_fkey" FOREIGN KEY ("A") REFERENCES "Predio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PredioToPropietario" ADD CONSTRAINT "_PredioToPropietario_B_fkey" FOREIGN KEY ("B") REFERENCES "Propietario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
