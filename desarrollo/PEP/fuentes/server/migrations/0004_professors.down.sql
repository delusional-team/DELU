-- Add down migration script here
DELETE FROM teachers_courses;

DELETE FROM teachers WHERE id IN (1, 2, 3, 4, 5, 6, 7);

DELETE FROM courses WHERE id >= 1 OR id <= 14;
