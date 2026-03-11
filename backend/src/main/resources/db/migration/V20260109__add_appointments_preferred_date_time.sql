-- Migration: Add preferred_date and preferred_time columns to appointments table
-- Database: MySQL
-- Date: 2026-01-09
-- Note: This script is idempotent - safe to run multiple times

USE ongolebulls;

SET @dbname = DATABASE();
SET @tablename = 'appointments';

-- Step 1: Add preferred_date column if it doesn't exist
SET @columnname = 'preferred_date';
SET @column_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
);

SET @preparedStatement = IF(@column_exists = 0,
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATE NOT NULL DEFAULT (CURRENT_DATE) AFTER mobile'),
    'SELECT ''Column preferred_date already exists'' AS message'
);

PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Step 2: Add preferred_time column if it doesn't exist
SET @columnname = 'preferred_time';
SET @column_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
);

SET @preparedStatement = IF(@column_exists = 0,
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TIME NOT NULL DEFAULT (CURRENT_TIME) AFTER preferred_date'),
    'SELECT ''Column preferred_time already exists'' AS message'
);

PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

SELECT 'Migration completed successfully! The preferred_date and preferred_time columns have been added.' AS result;

