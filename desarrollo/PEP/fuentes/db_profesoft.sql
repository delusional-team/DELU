CREATE TABLE "comments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "text" VARCHAR(255) NOT NULL,
  "grade" DOUBLE PRECISION NOT NULL,
  "user_id" INTEGER NOT NULL,
  "profesor_id" INTEGER NOT NULL,
  "forum_id" INTEGER NOT NULL,
);

CREATE TABLE "teachers_courses" (
  "profesor_id" INTEGER NOT NULL,
  "cursos_id" INTEGER NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "hashed_pass" VARCHAR(255) NOT NULL,
  "salt" VARCHAR(255) NOT NULL,
  "active" bool NOT NULL,
  "is_admin" bool NOT NULL,
  "is_banned" bool NOT NULL
);

CREATE TABLE "courses" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "code" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "semester" VARCHAR(255) NOT NULL,
  "study_plan_id" INTEGER NOT NULL
);

CREATE TABLE "teachers" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "grade" DOUBLE PRECISION NOT NULL
);

CREATE TABLE "forum" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "content" varchar(255) NOT NULL,
  "date" DATE NOT NULL,
  "user_id" integer NOT NULL
);

CREATE TABLE "study_plan" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "year" INTEGER NOT NULL
);

ALTER TABLE "comments" ADD CONSTRAINT "comments_profesor_id_foreign" FOREIGN KEY ("profesor_id") REFERENCES "teachers" ("id");

ALTER TABLE "teachers_courses" ADD CONSTRAINT "teachers_courses_profesor_id_foreign" FOREIGN KEY ("profesor_id") REFERENCES "teachers" ("id");

ALTER TABLE "teachers_courses" ADD CONSTRAINT "teachers_courses_cursos_id_foreign" FOREIGN KEY ("cursos_id") REFERENCES "courses" ("id");

ALTER TABLE "courses" ADD CONSTRAINT "study_plan_id_foreign" FOREIGN KEY ("study_plan_id") REFERENCES "study_plan" ("id");

ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comments" ADD CONSTRAINT "comments_forum_id_foreign" FOREIGN KEY ("forum_id") REFERENCES "forum" ("id");

ALTER TABLE "forum" ADD CONSTRAINT "forum_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users" ("id");
