-- Add up migration script here
CREATE TABLE IF NOT EXISTS "professor_comments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "text" VARCHAR(255) NOT NULL,
  "user_id" INTEGER NOT NULL REFERENCES users ("id"),
  "profesor_id" INTEGER NOT NULL REFERENCES "teachers" ("id")
);
