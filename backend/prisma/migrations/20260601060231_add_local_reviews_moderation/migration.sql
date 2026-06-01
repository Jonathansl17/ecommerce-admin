-- CreateEnum
CREATE TYPE "ModerationAction" AS ENUM ('rejected', 'deleted');

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "external_id" VARCHAR(100),
    "product_id" VARCHAR(100) NOT NULL,
    "product_name" VARCHAR(150) NOT NULL,
    "client_id" VARCHAR(100),
    "client_name" VARCHAR(150) NOT NULL,
    "client_email" VARCHAR(150),
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "helpful_votes" INTEGER NOT NULL DEFAULT 0,
    "unhelpful_votes" INTEGER NOT NULL DEFAULT 0,
    "is_priority" BOOLEAN NOT NULL DEFAULT false,
    "status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_responses" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "admin_id" BIGINT NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_records" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "admin_id" BIGINT NOT NULL,
    "action" "ModerationAction" NOT NULL DEFAULT 'rejected',
    "reason" "ModerationReason" NOT NULL,
    "notes" TEXT,
    "product_name" VARCHAR(150),
    "client_name" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_status_idx" ON "reviews"("status");

-- CreateIndex
CREATE INDEX "reviews_external_id_idx" ON "reviews"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_responses_review_id_key" ON "admin_responses"("review_id");

-- CreateIndex
CREATE INDEX "admin_responses_admin_id_idx" ON "admin_responses"("admin_id");

-- CreateIndex
CREATE INDEX "moderation_records_admin_id_idx" ON "moderation_records"("admin_id");

-- CreateIndex
CREATE INDEX "moderation_records_review_id_idx" ON "moderation_records"("review_id");

-- AddForeignKey
ALTER TABLE "admin_responses" ADD CONSTRAINT "admin_responses_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_responses" ADD CONSTRAINT "admin_responses_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_records" ADD CONSTRAINT "moderation_records_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
