CREATE TABLE `member_photos` (
	`team` text NOT NULL,
	`member` text NOT NULL,
	`bytes` blob NOT NULL,
	`revision` text NOT NULL,
	PRIMARY KEY(`team`, `member`)
);
