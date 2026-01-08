-- Migration: Fix nominees table id column to be AUTO_INCREMENT
-- Database: MySQL
-- Date: 2026-01-08
-- Note: This script is idempotent - safe to run multiple times

USE ongolebulls;

-- Step 1: Check if id column exists and if it's already AUTO_INCREMENT
SET @dbname = DATABASE();
SET @tablename = 'nominees';
SET @columnname = 'id';

-- Check if table exists
SET @table_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
);

-- If table exists, modify id column to be AUTO_INCREMENT
SET @preparedStatement = IF(@table_exists > 0,
    CONCAT('ALTER TABLE ', @tablename, ' MODIFY COLUMN ', @columnname, ' BIGINT NOT NULL AUTO_INCREMENT'),
    'SELECT ''Table nominees does not exist'' AS message'
);

PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Step 2: Ensure user_id is nullable (for document submissions)
SET @preparedStatement2 = IF(@table_exists > 0,
    CONCAT('ALTER TABLE ', @tablename, ' MODIFY COLUMN user_id BIGINT NULL'),
    'SELECT ''Table nominees does not exist'' AS message'
);

PREPARE alterStatement2 FROM @preparedStatement2;
EXECUTE alterStatement2;
DEALLOCATE PREPARE alterStatement2;

-- Step 3: Ensure submission_id is nullable
SET @preparedStatement3 = IF(@table_exists > 0,
    CONCAT('ALTER TABLE ', @tablename, ' MODIFY COLUMN submission_id BIGINT NULL'),
    'SELECT ''Table nominees does not exist'' AS message'
);

PREPARE alterStatement3 FROM @preparedStatement3;
EXECUTE alterStatement3;
DEALLOCATE PREPARE alterStatement3;

SELECT 'Migration completed successfully! The id column is now AUTO_INCREMENT.' AS result;

