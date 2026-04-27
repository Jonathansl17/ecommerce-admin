-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ProductStockMovementType" AS ENUM ('sale', 'manual_adjustment', 'production');

-- CreateTable
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price_override" DECIMAL(10,2),
    "current_stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_stock_movements" (
    "id" BIGSERIAL NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "admin_id" BIGINT NOT NULL,
    "sale_id" BIGINT,
    "type" "ProductStockMovementType" NOT NULL,
    "previous_quantity" INTEGER NOT NULL,
    "new_quantity" INTEGER NOT NULL,
    "reason" "StockMovementReason",
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_variants_product_id_idx" ON "product_variants"("product_id");

-- CreateIndex
CREATE INDEX "product_stock_movements_variant_id_idx" ON "product_stock_movements"("variant_id");

-- CreateIndex
CREATE INDEX "product_stock_movements_admin_id_idx" ON "product_stock_movements"("admin_id");

-- CreateIndex
CREATE INDEX "product_stock_movements_sale_id_idx" ON "product_stock_movements"("sale_id");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stock_movements" ADD CONSTRAINT "product_stock_movements_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
