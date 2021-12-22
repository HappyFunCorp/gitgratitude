-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "major" INTEGER,
ADD COLUMN     "minor" INTEGER,
ADD COLUMN     "patch" INTEGER,
ADD COLUMN     "prerelease" TEXT;
