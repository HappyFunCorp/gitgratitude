/*
  Warnings:

  - You are about to drop the column `ref_string` on the `Repository` table. All the data in the column will be lost.
  - Added the required column `ref_bytes` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "ref_string",
ADD COLUMN     "ref_bytes" BYTEA NOT NULL;
