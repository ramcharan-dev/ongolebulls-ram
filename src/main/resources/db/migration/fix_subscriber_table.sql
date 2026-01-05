-- Quick Fix Script: Manually add missing columns to subscriber table
-- Run this if Hibernate auto-migration failed
-- Database: MySQL

USE ongolebulls;

-- Check and add status column
SET @status_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ongolebulls'
    AND TABLE_NAME = 'subscriber'
    AND COLUMN_NAME = 'status'
);

SET @sql_status = IF(@status_exists = 0,
    'ALTER TABLE subscriber ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT ''ACTIVE''',
    'SELECT ''status column already exists'' AS message'
);
PREPARE stmt FROM @sql_status;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add subscribed_at column (as nullable)
SET @subscribed_at_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ongolebulls'
    AND TABLE_NAME = 'subscriber'
    AND COLUMN_NAME = 'subscribed_at'
);

SET @sql_subscribed_at = IF(@subscribed_at_exists = 0,
    'ALTER TABLE subscriber ADD COLUMN subscribed_at DATETIME(6) NULL',
    'SELECT ''subscribed_at column already exists'' AS message'
);
PREPARE stmt FROM @sql_subscribed_at;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing rows
UPDATE subscriber 
SET subscribed_at = NOW() 
WHERE subscribed_at IS NULL;

-- Fix invalid datetime values
UPDATE subscriber 
SET subscribed_at = NOW() 
WHERE subscribed_at = '0000-00-00 00:00:00' OR subscribed_at < '1970-01-01 00:00:00';

-- Set status to ACTIVE for existing rows
UPDATE subscriber 
SET status = 'ACTIVE' 
WHERE status IS NULL OR status = '';

-- Add index if not exists
CREATE INDEX IF NOT EXISTS idx_subscriber_status ON subscriber(status);

SELECT 'Migration completed successfully!' AS result;

