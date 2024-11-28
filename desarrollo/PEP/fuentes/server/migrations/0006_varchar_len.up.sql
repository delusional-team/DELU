-- Add up migration script here
ALTER TABLE "professor_comments" ALTER COLUMN "text" TYPE TEXT;
ALTER TABLE "comments" ALTER COLUMN "text" TYPE TEXT;
ALTER TABLE "forum" ALTER COLUMN "content" TYPE TEXT, ALTER COLUMN "title" TYPE TEXT;
