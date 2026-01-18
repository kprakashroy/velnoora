-- Remove the name column from app.products and drop related index
DO $$
BEGIN
    -- Drop index on name if it exists
    PERFORM 1 FROM pg_indexes WHERE schemaname = 'app' AND indexname = 'idx_products_name';
    IF FOUND THEN
        EXECUTE 'DROP INDEX IF EXISTS app.idx_products_name';
    END IF;

    -- Drop the name column if it exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'app'
          AND table_name = 'products'
          AND column_name = 'name'
    ) THEN
        EXECUTE 'ALTER TABLE app.products DROP COLUMN IF EXISTS name';
    END IF;
END $$;


