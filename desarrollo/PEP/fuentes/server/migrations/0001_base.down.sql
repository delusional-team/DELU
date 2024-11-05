DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'forum_user_id_foreign') THEN
        ALTER TABLE "forum" DROP CONSTRAINT "forum_user_id_foreign";
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'comments_forum_id_foreign') THEN
        ALTER TABLE "comments" DROP CONSTRAINT "comments_forum_id_foreign";
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'comments_user_id_foreign') THEN
        ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_foreign";
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'study_plan_id_foreign') THEN
        ALTER TABLE "courses" DROP CONSTRAINT "study_plan_id_foreign";
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'teachers_courses_cursos_id_foreign') THEN
        ALTER TABLE "teachers_courses" DROP CONSTRAINT "teachers_courses_cursos_id_foreign";
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'teachers_courses_profesor_id_foreign') THEN
        ALTER TABLE "teachers_courses" DROP CONSTRAINT "teachers_courses_profesor_id_foreign";
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'comments_profesor_id_foreign') THEN
        ALTER TABLE "comments" DROP CONSTRAINT "comments_profesor_id_foreign";
    END IF;
END $$;

DROP TABLE IF EXISTS "study_plan";
DROP TABLE IF EXISTS "forum";
DROP TABLE IF EXISTS "teachers";
DROP TABLE IF EXISTS "courses";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "teachers_courses";
DROP TABLE IF EXISTS "comments";
