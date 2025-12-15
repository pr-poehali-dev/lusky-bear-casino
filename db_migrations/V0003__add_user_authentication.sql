-- Add authentication fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS uid BIGINT UNIQUE;

-- Update existing users with random UID
UPDATE users SET uid = (FLOOR(RANDOM() * 9000000000) + 1000000000)::BIGINT WHERE uid IS NULL;

-- Update nickname field name
ALTER TABLE users ALTER COLUMN nickname SET DEFAULT 'Игрок';