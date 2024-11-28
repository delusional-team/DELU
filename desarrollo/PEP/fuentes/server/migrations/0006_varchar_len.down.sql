-- Add down migration script here

ALTER TABLE "professor_comments" ALTER COLUMN "text" TYPE VARCHAR(255);
ALTER TABLE "comments" ALTER COLUMN "text" TYPE VARCHAR(255);
ALTER TABLE "forum" ALTER COLUMN "content" TYPE VARCHAR(255), ALTER COLUMN "title" TYPE VARCHAR(255);
