-- Drop FKs/indexes first, then tables in dependency order
DROP TABLE IF EXISTS "moderation_records";
DROP TABLE IF EXISTS "admin_responses";
DROP TABLE IF EXISTS "reviews";
