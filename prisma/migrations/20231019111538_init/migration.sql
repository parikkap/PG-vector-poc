-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "embedding" vector(3),

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);
