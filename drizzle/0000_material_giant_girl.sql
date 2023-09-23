CREATE TABLE `translation` (
	`id` integer PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL
);
