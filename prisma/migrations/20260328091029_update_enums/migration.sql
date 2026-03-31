/*
  Warnings:

  - The values [Masculino,Femenino] on the enum `Sexo` will be removed. If these variants are still used in the database, this will fail.
  - The values [Consultório,Domicílio] on the enum `Tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Sexo_new" AS ENUM ('MASCULINO', 'FEMENINO');
ALTER TABLE "Patient" ALTER COLUMN "sex" TYPE "Sexo_new" USING ("sex"::text::"Sexo_new");
ALTER TYPE "Sexo" RENAME TO "Sexo_old";
ALTER TYPE "Sexo_new" RENAME TO "Sexo";
DROP TYPE "Sexo_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Tipo_new" AS ENUM ('CONSULTORIO', 'DOMICILIO');
ALTER TABLE "Appointment" ALTER COLUMN "type" TYPE "Tipo_new" USING ("type"::text::"Tipo_new");
ALTER TYPE "Tipo" RENAME TO "Tipo_old";
ALTER TYPE "Tipo_new" RENAME TO "Tipo";
DROP TYPE "Tipo_old";
COMMIT;
