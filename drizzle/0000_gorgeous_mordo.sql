CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`lead_type` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`location` text DEFAULT 'Noida' NOT NULL,
	`service_or_condition` text NOT NULL,
	`preferred_date` text DEFAULT '' NOT NULL,
	`preferred_time` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`marketing_consent` integer DEFAULT false NOT NULL,
	`privacy_consent` integer DEFAULT false NOT NULL,
	`source_page` text DEFAULT 'website' NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`assigned_to` text DEFAULT 'Noida front desk' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_reference_unique` ON `leads` (`reference`);