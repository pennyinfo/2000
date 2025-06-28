/*
  # Add missing registration status enum values

  1. Changes
    - Add 'Pending', 'Approved', and 'Rejected' values to the registration_status enum
    - These values are needed for the registration workflow in the application

  2. Security
    - No security changes needed for this migration
*/

-- Add the missing enum values to registration_status
DO $$
BEGIN
  -- Add 'Pending' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'Pending' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'registration_status')
  ) THEN
    ALTER TYPE registration_status ADD VALUE 'Pending';
  END IF;

  -- Add 'Approved' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'Approved' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'registration_status')
  ) THEN
    ALTER TYPE registration_status ADD VALUE 'Approved';
  END IF;

  -- Add 'Rejected' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'Rejected' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'registration_status')
  ) THEN
    ALTER TYPE registration_status ADD VALUE 'Rejected';
  END IF;
END $$;