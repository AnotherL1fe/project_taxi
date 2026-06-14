/*
  Warnings:

  - You are about to drop the column `phone` on the `Taxis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Taxis" DROP COLUMN "phone",
ADD COLUMN     "phones" TEXT[];
