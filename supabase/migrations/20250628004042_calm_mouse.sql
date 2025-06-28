/*
  # Add created_at column to registrations table

  1. Changes
    - Add `created_at` column to `registrations` table if it doesn't exist
    - Set default value to current timestamp for new records
    - Update existing records to have a created_at timestamp

  2. Security
    - No RLS changes needed as this is just adding a timestamp column
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

-- Update existing records to have a created_at value using current timestamp
UPDATE registrations 
SET created_at = now() 
WHERE created_at IS NULL;

-- Ensure the column has a default value for future inserts
ALTER TABLE registrations ALTER COLUMN created_at SET DEFAULT now();