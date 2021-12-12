-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "remote" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN,
    "last_pull" TIMESTAMP(3),
    "ref_string" TEXT NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);
