/*
  Warnings:

  - You are about to drop the column `project_start` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "project_start",
ADD COLUMN     "git" TEXT,
ADD COLUMN     "summary" TEXT;

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "released" TIMESTAMP(3),
    "summary" TEXT,
    "description" TEXT,
    "sha" TEXT,
    "license" TEXT,
    "download_count" INTEGER,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
