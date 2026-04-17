CREATE TYPE "public"."country_code" AS ENUM('US', 'MX', 'CO', 'AR', 'ES');--> statement-breakpoint
CREATE TYPE "public"."transfer_status" AS ENUM('pending', 'transit', 'received', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('global_admin', 'country_admin', 'viewer');--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "name" text NOT NULL,
  "role" "user_role" DEFAULT 'viewer' NOT NULL,
  "country_code" "country_code",
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email")
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "locations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" "country_code" NOT NULL,
  "name" text NOT NULL,
  "city" text NOT NULL,
  "currency" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "locations_code_unique" UNIQUE("code")
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "sku" text NOT NULL,
  "name" text NOT NULL,
  "category" text NOT NULL,
  "unit" text DEFAULT 'vial' NOT NULL,
  "cells" text,
  "last_synced" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "products_sku_unique" UNIQUE("sku")
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "stock_levels" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "location_id" uuid NOT NULL,
  "qty_on_hand" integer DEFAULT 0 NOT NULL,
  "threshold" integer DEFAULT 0 NOT NULL,
  "last_synced" timestamp with time zone,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "transfer_seq" (
  "id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
  "next_value" integer DEFAULT 1 NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "transfers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "reference_code" text NOT NULL,
  "from_location_id" uuid NOT NULL,
  "to_location_id" uuid NOT NULL,
  "product_id" uuid NOT NULL,
  "qty" integer NOT NULL,
  "status" "transfer_status" DEFAULT 'pending' NOT NULL,
  "urgent" boolean DEFAULT false NOT NULL,
  "note" text,
  "created_by" uuid NOT NULL,
  "approved_by" uuid,
  "received_by" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "transfers_reference_code_unique" UNIQUE("reference_code")
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "activity_log" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_type" text NOT NULL,
  "tone" text DEFAULT 'neutral' NOT NULL,
  "country_code" "country_code",
  "actor_id" uuid,
  "subject_type" text,
  "subject_id" uuid,
  "text" text NOT NULL,
  "payload" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_location_id_locations_id_fk" FOREIGN KEY ("from_location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_location_id_locations_id_fk" FOREIGN KEY ("to_location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "transfers" ADD CONSTRAINT "transfers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "transfers" ADD CONSTRAINT "transfers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "transfers" ADD CONSTRAINT "transfers_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "transfers" ADD CONSTRAINT "transfers_received_by_users_id_fk" FOREIGN KEY ("received_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "stock_product_location_idx" ON "stock_levels" ("product_id","location_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stock_location_idx" ON "stock_levels" ("location_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfers_status_idx" ON "transfers" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfers_to_idx" ON "transfers" ("to_location_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfers_from_idx" ON "transfers" ("from_location_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_country_created_idx" ON "activity_log" ("country_code","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_type_idx" ON "activity_log" ("event_type");
