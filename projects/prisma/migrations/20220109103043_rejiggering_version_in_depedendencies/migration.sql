/*
  Warnings:

  - You are about to drop the column `current_version` on the `dependencies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dependencies" DROP COLUMN "current_version",
ADD COLUMN     "major" INTEGER,
ADD COLUMN     "major_outdated" BOOLEAN,
ADD COLUMN     "minor" INTEGER,
ADD COLUMN     "minor_outdated" BOOLEAN,
ADD COLUMN     "patch" INTEGER,
ADD COLUMN     "patch_outdated" BOOLEAN,
ADD COLUMN     "prerelease" BOOLEAN,
ADD COLUMN     "release_id" TEXT,
ADD COLUMN     "suffix" TEXT;

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
