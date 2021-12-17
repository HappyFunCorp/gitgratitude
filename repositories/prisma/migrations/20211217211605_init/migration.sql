-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "remote" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN,
    "last_proccessed" TIMESTAMP(3),
    "duration" INTEGER,
    "ref_bytes" BYTEA,
    "summary_db_url" TEXT,
    "log_url" TEXT,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_remote_key" ON "Repository"("remote");
