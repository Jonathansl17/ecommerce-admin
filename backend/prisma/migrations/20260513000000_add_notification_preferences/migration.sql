-- CreateTable
CREATE TABLE "notification_preferences" (
    "admin_user_id" BIGINT NOT NULL,
    "receive_order_notifications" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("admin_user_id")
);

-- AlterTable
ALTER TABLE "products" ADD COLUMN "is_customizable" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_admin_user_id_fkey"
    FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
