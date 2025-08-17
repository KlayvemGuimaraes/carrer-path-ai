CREATE TABLE `profile_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`bio` text NOT NULL,
	`skills` text NOT NULL,
	`profile_image` text,
	`theme` text DEFAULT 'blue' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
