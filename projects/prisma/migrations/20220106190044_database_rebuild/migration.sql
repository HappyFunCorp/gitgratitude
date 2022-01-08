-- CreateEnum
CREATE TYPE "EcosystemName" AS ENUM ('rubygems', 'npm', 'cocoapods');

-- CreateEnum
CREATE TYPE "LockfileType" AS ENUM ('gemfile', 'yarn', 'npm', 'podlock');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ecosystem" "EcosystemName" NOT NULL,
    "name" TEXT NOT NULL,
    "homepage" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "git" TEXT,
    "first_release" TIMESTAMP(3),
    "latest_release" TIMESTAMP(3),
    "latest_version" TEXT,
    "last_synced" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "releases" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "major" INTEGER,
    "minor" INTEGER,
    "patch" INTEGER,
    "prerelease" BOOLEAN,
    "suffix" TEXT,
    "released" TIMESTAMP(3),
    "summary" TEXT,
    "description" TEXT,
    "sha" TEXT,
    "license" TEXT,
    "download_count" INTEGER,

    CONSTRAINT "releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lockfiles" (
    "id" TEXT NOT NULL,
    "file_type" "LockfileType" NOT NULL,
    "ecosystem" "EcosystemName" NOT NULL,
    "name" TEXT NOT NULL,
    "valid" BOOLEAN,
    "parsed" BOOLEAN NOT NULL DEFAULT false,
    "data" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "lockfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependencies" (
    "id" TEXT NOT NULL,
    "lockfile_id" TEXT NOT NULL,
    "project_id" TEXT,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "current_version" TEXT,
    "synced" TIMESTAMP(3),

    CONSTRAINT "dependencies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_lockfile_id_fkey" FOREIGN KEY ("lockfile_id") REFERENCES "lockfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependencies" ADD CONSTRAINT "dependencies_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
