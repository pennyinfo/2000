/*
  # Add created_at column to registrations table

  1. Changes
    - Add `created_at` column to `registrations` table with timestamp type
    - Set default value to current timestamp
    - Update existing records to have a created_at value based on submitted_at or current time

  2. Notes
    - This fixes the missing column error when querying registrations
    - Existing records will get a created_at timestamp based on their submitted_at value if available
    - New records will automatically get the current timestamp
*/

-- Add the created_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE registrations ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update existing records to have a created_at value
-- Use submitted_at if available, otherwise use current timestamp
UPDATE registrations 
SET created_at = COALESCE(submitted_at, now()) 
WHERE created_at IS NULL;

-- Ensure the column has a default value for future inserts
ALTER TABLE registrations ALTER COLUMN created_at SET DEFAULT now();