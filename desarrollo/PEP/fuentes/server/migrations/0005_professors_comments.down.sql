-- Add down migration script here

DROP TABLE IF EXISTS professor_comments;

DROP FUNCTION IF EXISTS recalculate_profesor_grade;

DROP TRIGGER IF EXISTS recalculate_profesor_grade ON professor_comments;
