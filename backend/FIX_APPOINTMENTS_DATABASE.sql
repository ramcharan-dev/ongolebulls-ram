-- Quick Fix SQL Script: Add preferred_date and preferred_time columns to appointments table
-- Run this script on your production database to fix the "Unknown column" error
-- Database: MySQL
-- Date: 2026-01-09

USE ongolebulls;

-- Add preferred_date column if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ongolebulls'
    AND TABLE_NAME = 'appointments'
    AND COLUMN_NAME = 'preferred_date'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE appointments ADD COLUMN preferred_date DATE NOT NULL DEFAULT (CURRENT_DATE) AFTER mobile',
    'SELECT ''Column preferred_date already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add preferred_time column if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ongolebulls'
    AND TABLE_NAME = 'appointments'
    AND COLUMN_NAME = 'preferred_time'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE appointments ADD COLUMN preferred_time TIME NOT NULL DEFAULT (CURRENT_TIME) AFTER preferred_date',
    'SELECT ''Column preferred_time already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Fix completed! The preferred_date and preferred_time columns have been added to the appointments table.' AS result;

