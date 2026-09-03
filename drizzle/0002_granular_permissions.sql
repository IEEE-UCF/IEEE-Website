ALTER TABLE "member_permissions" ALTER COLUMN "context_type" SET DEFAULT 'global';--> statement-breakpoint
ALTER TABLE "member_permissions" ALTER COLUMN "permission" SET DATA TYPE varchar(64);--> statement-breakpoint
DROP TYPE "public"."permission_enum";