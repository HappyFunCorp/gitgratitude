/*
  Warnings:

  - You are about to drop the column `ecosystem_name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Ecosystem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ecosystem` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EcosystemName" AS ENUM ('rubygems', 'npm');

-- CreateEnum
CREATE TYPE "LockfileType" AS ENUM ('gemfile', 'yarn', 'npm');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ecosystem_name_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "ecosystem_name",
ADD COLUMN     "ecosystem" "EcosystemName" NOT NULL;

-- DropTable
DROP TABLE "Ecosystem";

-- CreateTable
CREATE TABLE "Lockfile" (
    "id" TEXT NOT NULL,
    "file_type" "LockfileType" NOT NULL,
    "ecosystem" "EcosystemName" NOT NULL,
    "name" TEXT NOT NULL,
    "valid" BOOLEAN,
    "parsed" BOOLEAN NOT NULL DEFAULT false,
    "data" BYTEA NOT NULL,
    "uploadedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Lockfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependancy" (
    "id" TEXT NOT NULL,
    "lockfile_id" TEXT NOT NULL,
    "project_id" TEXT,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "current_version" TEXT NOT NULL,
    "synced" TIMESTAMP(3),

    CONSTRAINT "Dependancy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dependancy" ADD CONSTRAINT "Dependancy_lockfile_id_fkey" FOREIGN KEY ("lockfile_id") REFERENCES "Lockfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependancy" ADD CONSTRAINT "Dependancy_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
