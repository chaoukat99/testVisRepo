-- COMPLETE MIGRATION SCRIPT - All Tables
-- Run this in your MySQL database to update ALL tables with country/city structure

-- ==========================================
-- 1. MISSIONS TABLE
-- ==========================================

-- Add country and city columns
ALTER TABLE missions 
ADD COLUMN country VARCHAR(100) AFTER min_experience_category,
ADD COLUMN city VARCHAR(100) AFTER country;

-- Migrate existing data (split by comma)
UPDATE missions 
SET 
    city = TRIM(SUBSTRING_INDEX(location, ',', 1)),
    country = TRIM(SUBSTRING_INDEX(location, ',', -1))
WHERE location IS NOT NULL AND location != '';

-- For locations without comma, put everything in city
UPDATE missions 
SET 
    city = location,
    country = ''
WHERE location IS NOT NULL AND location != '' AND location NOT LIKE '%,%';

-- Make country and city NOT NULL
ALTER TABLE missions 
MODIFY COLUMN country VARCHAR(100) NOT NULL,
MODIFY COLUMN city VARCHAR(100) NOT NULL;

-- Add indexes
CREATE INDEX idx_mission_country ON missions(country);
CREATE INDEX idx_mission_city ON missions(city);

-- ==========================================
-- 2. CONSULTANT_SEARCH_REQUESTS TABLE
-- ==========================================

-- Add country and city columns
ALTER TABLE consultant_search_requests 
ADD COLUMN country VARCHAR(100) AFTER selected_job,
ADD COLUMN city VARCHAR(100) AFTER country;

-- Migrate existing data (split by comma)
UPDATE consultant_search_requests 
SET 
    city = TRIM(SUBSTRING_INDEX(location, ',', 1)),
    country = TRIM(SUBSTRING_INDEX(location, ',', -1))
WHERE location IS NOT NULL AND location != '';

-- For locations without comma, put everything in city
UPDATE consultant_search_requests 
SET 
    city = location,
    country = ''
WHERE location IS NOT NULL AND location != '' AND location NOT LIKE '%,%';

-- ==========================================
-- 3. ADD INDEXES FOR CONSULTANTS TABLE
-- ==========================================
-- (consultants already has pays_residence and ville, just add indexes)

CREATE INDEX idx_consultant_country ON consultants(pays_residence);
CREATE INDEX idx_consultant_city ON consultants(ville);

-- ==========================================
-- 4. (OPTIONAL) DROP OLD LOCATION COLUMNS
-- ==========================================
-- Uncomment these lines ONLY after verifying the migration worked correctly

-- ALTER TABLE missions DROP COLUMN location;
-- ALTER TABLE consultant_search_requests DROP COLUMN location;

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================
-- Run these to verify the migration worked:

-- Check missions table structure
-- DESCRIBE missions;

-- Check consultant_search_requests table structure
-- DESCRIBE consultant_search_requests;

-- View sample migrated data
-- SELECT id, country, city FROM missions LIMIT 10;
-- SELECT id, country, city FROM consultant_search_requests LIMIT 10;

-- DONE! All tables now use separate country and city columns.
