/*
  Warnings:

  - You are about to drop the column `admin_user_id` on the `admin_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `admin_user_id` on the `admin_responses` table. All the data in the column will be lost.
  - You are about to drop the column `admin_user_id` on the `custom_orders` table. All the data in the column will be lost.
  - You are about to drop the column `admin_user_id` on the `inventory_movements` table. All the data in the column will be lost.
  - You are about to drop the column `admin_user_id` on the `moderation_records` table. All the data in the column will be lost.
  - You are about to drop the column `admin_user_id` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `admin_user_id` on the `stock_movements` table. All the data in the column will be lost.
  - Added the required column `admin_id` to the `admin_notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `admin_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `custom_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `inventory_movements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `moderation_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `stock_movements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admin_notifications" DROP CONSTRAINT "admin_notifications_admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_responses" DROP CONSTRAINT "admin_responses_admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_orders" DROP CONSTRAINT "custom_orders_admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_movements" DROP CONSTRAINT "inventory_movements_admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "moderation_records" DROP CONSTRAINT "moderation_records_admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_admin_user_id_fkey";

-- DropIndex
DROP INDEX "admin_notifications_admin_user_id_idx";

-- DropIndex
DROP INDEX "admin_responses_admin_user_id_idx";

-- DropIndex
DROP INDEX "custom_orders_admin_user_id_idx";

-- DropIndex
DROP INDEX "inventory_movements_admin_user_id_idx";

-- DropIndex
DROP INDEX "moderation_records_admin_user_id_idx";

-- DropIndex
DROP INDEX "sales_admin_user_id_idx";

-- DropIndex
DROP INDEX "stock_movements_admin_user_id_idx";

-- DropIndex
DROP INDEX "supply_alerts_supply_id_key";

-- AlterTable
ALTER TABLE "admin_notifications" DROP COLUMN "admin_user_id",
ADD COLUMN     "admin_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "admin_responses" DROP COLUMN "admin_user_id",
ADD COLUMN     "admin_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "custom_orders" DROP COLUMN "admin_user_id",
ADD COLUMN     "admin_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "inventory_movements" DROP COLUMN "admin_user_id",
ADD COLUMN     "admin_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "moderation_records" DROP COLUMN "admin_user_id",
ADD COLUMN     "admin_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "admin_user_id",
ADD COLUMN     "admin_id" BIGINT NOT NULL,
ALTER COLUMN "order_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "admin_user_id",
ADD COLUMN     "admin_id" BIGINT NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;

-- CreateTable
CREATE TABLE "revoked_tokens" (
    "id" BIGSERIAL NOT NULL,
    "jti" VARCHAR(36) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revoked_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "revoked_tokens_jti_key" ON "revoked_tokens"("jti");

-- CreateIndex
CREATE INDEX "revoked_tokens_expires_at_idx" ON "revoked_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "admin_notifications_admin_id_idx" ON "admin_notifications"("admin_id");

-- CreateIndex
CREATE INDEX "admin_responses_admin_id_idx" ON "admin_responses"("admin_id");

-- CreateIndex
CREATE INDEX "custom_orders_admin_id_idx" ON "custom_orders"("admin_id");

-- CreateIndex
CREATE INDEX "inventory_movements_admin_id_idx" ON "inventory_movements"("admin_id");

-- CreateIndex
CREATE INDEX "moderation_records_admin_id_idx" ON "moderation_records"("admin_id");

-- CreateIndex
CREATE INDEX "sales_admin_id_idx" ON "sales"("admin_id");

-- CreateIndex
CREATE INDEX "stock_movements_admin_id_idx" ON "stock_movements"("admin_id");

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_orders" ADD CONSTRAINT "custom_orders_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_responses" ADD CONSTRAINT "admin_responses_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_records" ADD CONSTRAINT "moderation_records_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notifications" ADD CONSTRAINT "admin_notifications_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("admin_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
