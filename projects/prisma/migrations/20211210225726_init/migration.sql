-- CreateTable
CREATE TABLE "Ecosystem" (
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ecosystem_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "homepage" TEXT,
    "description" TEXT,
    "project_start" TIMESTAMP(3),
    "first_release" TIMESTAMP(3),
    "latest_release" TIMESTAMP(3),
    "latest_version" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ecosystem_name_key" ON "Ecosystem"("name");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ecosystem_name_fkey" FOREIGN KEY ("ecosystem_name") REFERENCES "Ecosystem"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
