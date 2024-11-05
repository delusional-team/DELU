-- Add up migration script here

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email') THEN
        ALTER TABLE users ADD CONSTRAINT users_unique_email UNIQUE(email);
    END IF;
END $$;
