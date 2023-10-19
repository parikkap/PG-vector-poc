-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "Embeddings" (
    "id" SERIAL NOT NULL,
    "embedding" vector(3),

    CONSTRAINT "Embeddings_pkey" PRIMARY KEY ("id")
);
