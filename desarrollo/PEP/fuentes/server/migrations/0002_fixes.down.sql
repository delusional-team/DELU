DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='forum' AND column_name='upvotes') THEN
        ALTER TABLE forum DROP COLUMN upvotes;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='profesor_id') THEN
        ALTER TABLE comments ADD COLUMN profesor_id INTEGER;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='upvotes') THEN
        ALTER TABLE comments RENAME COLUMN upvotes TO grade;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='grade') THEN
        ALTER TABLE comments ALTER COLUMN grade TYPE DOUBLE PRECISION;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='description') THEN
        ALTER TABLE courses DROP COLUMN description;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='department') THEN
        ALTER TABLE teachers DROP COLUMN department;
    END IF;
END $$;
