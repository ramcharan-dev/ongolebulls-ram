-- Migration: Make preferred_date and preferred_time columns nullable in appointments table
-- Database: MySQL
-- Date: 2026-01-09
-- Note: This script is idempotent - safe to run multiple times

USE ongolebulls;

SET @dbname = DATABASE();
SET @tablename = 'appointments';

-- Step 1: Make preferred_date column nullable if it exists
SET @columnname = 'preferred_date';
SET @column_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
);

SET @preparedStatement = IF(@column_exists > 0,
    CONCAT('ALTER TABLE ', @tablename, ' MODIFY COLUMN ', @columnname, ' DATE NULL'),
    'SELECT ''Column preferred_date does not exist'' AS message'
);

PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Step 2: Make preferred_time column nullable if it exists
SET @columnname = 'preferred_time';
SET @column_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
);

SET @preparedStatement = IF(@column_exists > 0,
    CONCAT('ALTER TABLE ', @tablename, ' MODIFY COLUMN ', @columnname, ' TIME NULL'),
    'SELECT ''Column preferred_time does not exist'' AS message'
);

PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

SELECT 'Migration completed successfully! The preferred_date and preferred_time columns are now nullable.' AS result;

