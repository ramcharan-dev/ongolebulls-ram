-- Fix nominees table structure
-- Run this SQL script in your MySQL database
-- This script fixes the id column to be AUTO_INCREMENT

USE ongolebulls;

-- Step 1: Make sure id has AUTO_INCREMENT (this is the critical fix)
ALTER TABLE nominees MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- Step 2: Make user_id nullable (it should be null for document submissions)
ALTER TABLE nominees MODIFY COLUMN user_id BIGINT NULL;

-- Step 3: Make submission_id nullable (will be set when saving)
ALTER TABLE nominees MODIFY COLUMN submission_id BIGINT NULL;

-- Verify the changes
DESCRIBE nominees;

-- Expected result: id column should show "auto_increment" in Extra column
SELECT 'Migration completed! The id column is now AUTO_INCREMENT.' AS result;

