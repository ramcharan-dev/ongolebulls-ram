-- SIMPLE FIX: Add preferred_date and preferred_time columns
-- Run this in your MySQL database (production or local)
-- This will work even if there are existing records in the table

USE ongolebulls;

-- Check and add preferred_date column
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ongolebulls' 
  AND TABLE_NAME = 'appointments' 
  AND COLUMN_NAME = 'preferred_date';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE appointments ADD COLUMN preferred_date DATE NOT NULL AFTER mobile',
    'SELECT "Column preferred_date already exists" AS message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add preferred_time column
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ongolebulls' 
  AND TABLE_NAME = 'appointments' 
  AND COLUMN_NAME = 'preferred_time';

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE appointments ADD COLUMN preferred_time TIME NOT NULL AFTER preferred_date',
    'SELECT "Column preferred_time already exists" AS message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'SUCCESS: Columns added to appointments table!' AS result;

