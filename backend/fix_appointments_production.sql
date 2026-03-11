-- Production Database Fix: Make preferred_date and preferred_time nullable
-- Run this script on your PRODUCTION database to fix the appointment form
-- Database: MySQL (Production)
-- Date: 2026-01-09

-- IMPORTANT: Replace 'ongolebulls' with your actual database name if different
USE ongolebulls;

-- Make preferred_date column nullable
ALTER TABLE appointments MODIFY COLUMN preferred_date DATE NULL;

-- Make preferred_time column nullable  
ALTER TABLE appointments MODIFY COLUMN preferred_time TIME NULL;

-- Verify the changes
SELECT 
    COLUMN_NAME, 
    IS_NULLABLE, 
    DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ongolebulls' 
AND TABLE_NAME = 'appointments' 
AND COLUMN_NAME IN ('preferred_date', 'preferred_time');

SELECT 'Migration completed successfully! The preferred_date and preferred_time columns are now nullable.' AS result;

