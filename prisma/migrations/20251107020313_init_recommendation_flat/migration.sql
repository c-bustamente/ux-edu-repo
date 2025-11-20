-- CreateTable
CREATE TABLE "recommendation_flat" (
    "input_id" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "status" TEXT,
    "pattern_ref" TEXT,
    "eva_type" TEXT,
    "platform" TEXT,
    "audience" TEXT,
    "title" TEXT,
    "how" TEXT,
    "why" TEXT,
    "recomendation" JSONB,
    "sources" JSONB,
    "raw_item" JSONB,
    "inserted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_flat_pkey" PRIMARY KEY ("input_id")
);
