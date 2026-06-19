CREATE TYPE "public"."item_status" AS ENUM('pending', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('youtube', 'twitter', 'reddit', 'github');--> statement-breakpoint
CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"color" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_item_tags" (
	"saved_item_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "saved_item_tags_saved_item_id_tag_id_pk" PRIMARY KEY("saved_item_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "saved_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"folder_id" uuid,
	"url" text NOT NULL,
	"platform" "platform",
	"status" "item_status" DEFAULT 'pending' NOT NULL,
	"title" text,
	"content" jsonb,
	"raw_payload" jsonb,
	"error" text,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"color" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_item_tags" ADD CONSTRAINT "saved_item_tags_saved_item_id_saved_items_id_fk" FOREIGN KEY ("saved_item_id") REFERENCES "public"."saved_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_item_tags" ADD CONSTRAINT "saved_item_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "folders_user_id_slug_key" ON "folders" USING btree ("user_id","slug");--> statement-breakpoint
CREATE INDEX "saved_item_tags_tag_id_idx" ON "saved_item_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "saved_items_user_id_idx" ON "saved_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_items_status_idx" ON "saved_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "saved_items_folder_id_idx" ON "saved_items" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "saved_items_user_id_saved_at_idx" ON "saved_items" USING btree ("user_id","saved_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_user_id_slug_key" ON "tags" USING btree ("user_id","slug");