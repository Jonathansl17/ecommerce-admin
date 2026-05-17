-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "external_id" VARCHAR(100) NOT NULL,
    "product_id" VARCHAR(100) NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "client_id" VARCHAR(100),
    "client_name" VARCHAR(100) NOT NULL,
    "client_email" VARCHAR(150),
    "rating" INTEGER NOT NULL,
    "review_text" TEXT NOT NULL,
    "is_priority" BOOLEAN NOT NULL DEFAULT false,
    "status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_status_idx" ON "reviews"("status");

-- CreateIndex
CREATE INDEX "reviews_external_id_idx" ON "reviews"("external_id");

-- AlterTable: add unique constraint on review_id to enforce one-to-one relationship
ALTER TABLE "admin_responses" ADD CONSTRAINT "admin_responses_review_id_key" UNIQUE ("review_id");

-- AlterTable: add unique constraint on review_id to enforce one-to-one relationship
ALTER TABLE "moderation_records" ADD CONSTRAINT "moderation_records_review_id_key" UNIQUE ("review_id");

-- AddForeignKey
ALTER TABLE "admin_responses" ADD CONSTRAINT "admin_responses_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_records" ADD CONSTRAINT "moderation_records_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
