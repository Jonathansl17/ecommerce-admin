-- AlterTable
ALTER TABLE "admin_notifications" ADD COLUMN     "entity_external_id" VARCHAR(100);

-- DropEnum
DROP TYPE IF EXISTS "ModerationReason";

-- DropEnum
DROP TYPE IF EXISTS "ReviewStatus";

-- CreateIndex
CREATE INDEX "admin_notifications_admin_id_entity_type_entity_external_id_idx" ON "admin_notifications"("admin_id", "entity_type", "entity_external_id");
