-- Add up migration script here
CREATE TABLE IF NOT EXISTS "professor_comments" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "text" VARCHAR(255) NOT NULL,
  "user_id" INTEGER NOT NULL REFERENCES users ("id"),
  "profesor_id" INTEGER NOT NULL REFERENCES "teachers" ("id"),
  "grade" INTEGER NOT NULL
);

CREATE OR REPLACE FUNCTION recalculate_profesor_grade()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE teachers
  SET grade = (SELECT AVG(grade) FROM professor_comments WHERE profesor_id = NEW.profesor_id)
  WHERE id = NEW.profesor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER recalculate_profesor_grade
AFTER INSERT OR DELETE OR UPDATE
ON professor_comments
FOR EACH ROW
EXECUTE PROCEDURE recalculate_profesor_grade();
