DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_unique_email') THEN
        ALTER TABLE users DROP CONSTRAINT users_unique_email;
    END IF;
END $$;-- Add down migration script here
