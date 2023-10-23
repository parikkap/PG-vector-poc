-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "embedding" vector(1536),
    "document" TEXT NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);
