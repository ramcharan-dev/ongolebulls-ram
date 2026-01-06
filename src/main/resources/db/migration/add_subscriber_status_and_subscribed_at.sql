-- Migration: Add status and subscribed_at columns to subscriber table
-- Database: MySQL
-- Date: 2024
-- Note: This script is idempotent - safe to run multiple times

-- Step 1: Add status column with default value ACTIVE (if not exists)
SET @dbname = DATABASE();
SET @tablename = 'subscriber';
SET @columnname = 'status';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(20) NOT NULL DEFAULT ''ACTIVE''')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 2: Add subscribed_at column as NULLABLE first (if not exists)
SET @columnname = 'subscribed_at';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (COLUMN_NAME = @columnname)
    ) > 0,
    'SELECT 1',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATETIME(6) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 3: Update existing rows to have subscribed_at = current timestamp if NULL
UPDATE subscriber 
SET subscribed_at = NOW() 
WHERE subscribed_at IS NULL;

-- Step 4: Fix any invalid datetime values (0000-00-00 00:00:00)
UPDATE subscriber 
SET subscribed_at = NOW() 
WHERE subscribed_at = '0000-00-00 00:00:00' OR subscribed_at < '1970-01-01 00:00:00';

-- Step 5: Add index on status for better query performance
SET @indexname = 'idx_subscriber_status';
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
        WHERE
            (TABLE_SCHEMA = @dbname)
            AND (TABLE_NAME = @tablename)
            AND (INDEX_NAME = @indexname)
    ) > 0,
    'SELECT 1',
    CONCAT('CREATE INDEX ', @indexname, ' ON ', @tablename, '(status)')
));
PREPARE createIndexIfNotExists FROM @preparedStatement;
EXECUTE createIndexIfNotExists;
DEALLOCATE PREPARE createIndexIfNotExists;

-- Step 6: Update existing rows to have status = 'ACTIVE' if NULL or empty (safety check)
UPDATE subscriber 
SET status = 'ACTIVE' 
WHERE status IS NULL OR status = '';

-- Note: subscribed_at remains nullable to avoid issues with existing data
-- New subscriptions will always have subscribed_at set via application code

