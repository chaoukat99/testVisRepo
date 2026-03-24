-- Migration: Replace location field with country and city fields
-- Date: 2026-01-13
-- Description: Updates the missions and consultant_search_requests tables to use separate country and city fields instead of a single location field

-- ==========================================
-- 1. UPDATE MISSIONS TABLE
-- ==========================================

-- Add new columns for country and city
ALTER TABLE missions 
ADD COLUMN country VARCHAR(100) AFTER min_experience_category,
ADD COLUMN city VARCHAR(100) AFTER country;

-- Migrate existing location data (split by comma if possible)
-- Note: This is a best-effort migration. Review and adjust as needed.
UPDATE missions 
SET 
    city = TRIM(SUBSTRING_INDEX(location, ',', 1)),
    country = TRIM(SUBSTRING_INDEX(location, ',', -1))
WHERE location IS NOT NULL AND location != '';

-- For cases where there's no comma, put everything in city
UPDATE missions 
SET 
    city = location,
    country = ''
WHERE location IS NOT NULL AND location != '' AND location NOT LIKE '%,%';

-- Make country and city NOT NULL after data migration
ALTER TABLE missions 
MODIFY COLUMN country VARCHAR(100) NOT NULL,
MODIFY COLUMN city VARCHAR(100) NOT NULL;

-- Drop the old location column (optional - comment this out if you want to keep it for rollback)
-- ALTER TABLE missions DROP COLUMN location;

-- ==========================================
-- 2. UPDATE CONSULTANT_SEARCH_REQUESTS TABLE
-- ==========================================

-- Add new columns for country and city
ALTER TABLE consultant_search_requests 
ADD COLUMN country VARCHAR(100) AFTER selected_job,
ADD COLUMN city VARCHAR(100) AFTER country;

-- Migrate existing location data
UPDATE consultant_search_requests 
SET 
    city = TRIM(SUBSTRING_INDEX(location, ',', 1)),
    country = TRIM(SUBSTRING_INDEX(location, ',', -1))
WHERE location IS NOT NULL AND location != '';

UPDATE consultant_search_requests 
SET 
    city = location,
    country = ''
WHERE location IS NOT NULL AND location != '' AND location NOT LIKE '%,%';

-- Drop the old location column (optional - comment this out if you want to keep it for rollback)
-- ALTER TABLE consultant_search_requests DROP COLUMN location;

-- ==========================================
-- 3. UPDATE INDEXES (Optional Performance Optimization)
-- ==========================================

-- Add indexes for country/city searches
CREATE INDEX idx_mission_country ON missions(country);
CREATE INDEX idx_mission_city ON missions(city);
CREATE INDEX idx_consultant_country ON consultants(pays_residence);
CREATE INDEX idx_consultant_city ON consultants(ville);

-- ==========================================
-- ROLLBACK SCRIPT (Keep for reference)
-- ==========================================
-- If you need to rollback this migration, run:
-- 
-- ALTER TABLE missions ADD COLUMN location VARCHAR(255);
-- UPDATE missions SET location = CONCAT(city, ', ', country) WHERE city IS NOT NULL AND country IS NOT NULL;
-- ALTER TABLE missions DROP COLUMN country, DROP COLUMN city;
-- 
-- ALTER TABLE consultant_search_requests ADD COLUMN location VARCHAR(255);
-- UPDATE consultant_search_requests SET location = CONCAT(city, ', ', country) WHERE city IS NOT NULL AND country IS NOT NULL;
-- ALTER TABLE consultant_search_requests DROP COLUMN country, DROP COLUMN city;
-- 
-- DROP INDEX idx_mission_country ON missions;
-- DROP INDEX idx_mission_city ON missions;
-- DROP INDEX idx_consultant_country ON consultants;
-- DROP INDEX idx_consultant_city ON consultants;
