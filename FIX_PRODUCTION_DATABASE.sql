-- ============================================================
-- PRODUCTION DATABASE FIX - RUN THIS IMMEDIATELY
-- ============================================================
-- This script fixes the "Field 'preferred_date' doesn't have a default value" error
-- Run this on your PRODUCTION database (AWS RDS)
-- ============================================================

-- Step 1: Connect to your production database
-- Replace 'ongolebulls' with your actual database name if different
USE ongolebulls;

-- Step 2: Make preferred_date nullable
ALTER TABLE appointments MODIFY COLUMN preferred_date DATE NULL;

-- Step 3: Make preferred_time nullable
ALTER TABLE appointments MODIFY COLUMN preferred_time TIME NULL;

-- Step 4: Verify the changes (optional - to confirm it worked)
SELECT 
    COLUMN_NAME, 
    IS_NULLABLE, 
    DATA_TYPE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ongolebulls' 
AND TABLE_NAME = 'appointments' 
AND COLUMN_NAME IN ('preferred_date', 'preferred_time');

-- Expected result: Both columns should show IS_NULLABLE = 'YES'

SELECT '✅ SUCCESS: preferred_date and preferred_time are now nullable!' AS status;

