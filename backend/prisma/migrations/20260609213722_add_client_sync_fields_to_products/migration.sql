-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category" VARCHAR(80),
ADD COLUMN     "client_item_id" BIGINT,
ADD COLUMN     "image_url" VARCHAR(300);
