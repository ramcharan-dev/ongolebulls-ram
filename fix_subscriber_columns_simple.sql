-- SIMPLE FIX: Add missing columns to subscriber table
-- Run this in MySQL Workbench or command line
-- If you get "Duplicate column" error, ignore it - column already exists

USE ongolebulls;

-- Add status column (may fail if exists - that's OK)
ALTER TABLE subscriber ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- Add subscribed_at column (may fail if exists - that's OK)  
ALTER TABLE subscriber ADD COLUMN subscribed_at DATETIME(6) NULL;

-- Update existing rows
UPDATE subscriber SET subscribed_at = NOW() WHERE subscribed_at IS NULL;
UPDATE subscriber SET subscribed_at = NOW() WHERE subscribed_at = '0000-00-00 00:00:00' OR subscribed_at < '1970-01-01 00:00:00';
UPDATE subscriber SET status = 'ACTIVE' WHERE status IS NULL OR status = '';

-- Add index (may fail if exists - that's OK)
CREATE INDEX idx_subscriber_status ON subscriber(status);

SELECT 'Done! Restart your Spring Boot application.' AS result;

