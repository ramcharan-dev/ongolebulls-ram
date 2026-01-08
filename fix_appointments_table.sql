-- Quick Fix Script: Make preferred_date and preferred_time columns nullable in appointments table
-- Run this to fix the database schema
-- Database: MySQL

USE ongolebulls;

-- Make preferred_date column nullable
ALTER TABLE appointments MODIFY COLUMN preferred_date DATE NULL;

-- Make preferred_time column nullable
ALTER TABLE appointments MODIFY COLUMN preferred_time TIME NULL;

SELECT 'Migration completed successfully! The preferred_date and preferred_time columns are now nullable.' AS result;

