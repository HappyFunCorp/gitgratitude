/*
  Warnings:

  - You are about to drop the column `ref_bytes` on the `Repository` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "ref_bytes",
ADD COLUMN     "refs_hash" TEXT;
