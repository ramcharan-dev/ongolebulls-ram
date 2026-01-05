-- Quick Fix: Add missing columns to subscriber table
-- Run this script in your MySQL database
-- Database: ongolebulls
-- Note: If you get "Duplicate column" errors, that means the column already exists - just continue

USE ongolebulls;

-- Step 1: Add status column (ignore error if already exists)
SET @sql = 'ALTER TABLE subscriber ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT ''ACTIVE''';
SET @error = 0;
CALL add_column_if_not_exists('subscriber', 'status', 'VARCHAR(20) NOT NULL DEFAULT ''ACTIVE''', @error);

-- If the above doesn't work, try this direct approach (may fail if column exists - that's OK):
-- ALTER TABLE subscriber ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- Step 2: Add subscribed_at column as nullable
-- ALTER TABLE subscriber ADD COLUMN subscribed_at DATETIME(6) NULL;

-- Step 3: Update existing rows with current timestamp
UPDATE subscriber 
SET subscribed_at = NOW() 
WHERE subscribed_at IS NULL;

-- Step 4: Fix any invalid datetime values  
UPDATE subscriber 
SET subscribed_at = NOW() 
WHERE subscribed_at = '0000-00-00 00:00:00' OR subscribed_at < '1970-01-01 00:00:00';

-- Step 5: Set status to ACTIVE for existing rows
UPDATE subscriber 
SET status = 'ACTIVE' 
WHERE status IS NULL OR status = '';

-- Step 6: Add index on status (ignore error if already exists)
-- CREATE INDEX idx_subscriber_status ON subscriber(status);

SELECT 'Migration completed! If you saw any "Duplicate column" errors, that is normal.' AS result;

