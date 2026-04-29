-- Move current_stock from product_variants to products
ALTER TABLE "products" ADD COLUMN "current_stock" INTEGER NOT NULL DEFAULT 0;

-- Remove current_stock from product_variants
ALTER TABLE "product_variants" DROP COLUMN "current_stock";

-- Drop FK and index on variant_id from product_stock_movements
ALTER TABLE "product_stock_movements" DROP CONSTRAINT "product_stock_movements_variant_id_fkey";
DROP INDEX "product_stock_movements_variant_id_idx";
ALTER TABLE "product_stock_movements" DROP COLUMN "variant_id";

-- Add product_id to product_stock_movements
ALTER TABLE "product_stock_movements" ADD COLUMN "product_id" BIGINT NOT NULL;
CREATE INDEX "product_stock_movements_product_id_idx" ON "product_stock_movements"("product_id");
ALTER TABLE "product_stock_movements" ADD CONSTRAINT "product_stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
