-- Add up migration script here

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='department') THEN
        ALTER TABLE teachers ADD COLUMN department varchar(255);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='description') THEN
        ALTER TABLE courses ADD COLUMN description varchar(255);
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='grade') THEN
        ALTER TABLE comments RENAME COLUMN grade TO upvotes;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='upvotes') THEN
        ALTER TABLE comments ALTER COLUMN upvotes TYPE integer;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='profesor_id') THEN
        ALTER TABLE comments DROP COLUMN profesor_id;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='forum' AND column_name='upvotes') THEN
        ALTER TABLE forum ADD COLUMN upvotes integer;
    END IF;
END $$;
