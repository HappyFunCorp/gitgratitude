/*
  Warnings:

  - The `prerelease` column on the `Release` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "suffix" TEXT,
DROP COLUMN "prerelease",
ADD COLUMN     "prerelease" BOOLEAN;
