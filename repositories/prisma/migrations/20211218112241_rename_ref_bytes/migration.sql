-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "created" TIMESTAMP(3),
ADD COLUMN     "last_changed" TIMESTAMP(3),
ADD COLUMN     "root_sha" TEXT;
