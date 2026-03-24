# Backend Updates Required for Countries API Integration

## Summary
Yes, the backend **MUST be updated** to work with the new country/city structure. This document outlines all the changes that have been made to both frontend and backend.

## ✅ Completed Backend Changes

### 1. **Server Controllers Updated**

#### `server/controllers/mission.controller.js`
- ✅ Updated `createMission` to accept `country` and `city` instead of `location`
- ✅ Modified SQL INSERT to use separate country/city columns
- ✅ Updated parameter destructuring

#### `server/controllers/consultant.controller.js`
- ✅ Updated `searchConsultants` to accept `country` and `city` query parameters
- ✅ Changed search logic from LIKE pattern matching on combined location to exact matches on country/city
- ✅ More precise filtering (country = exact, city = exact)

### 2. **Frontend API Service Updated**

#### `src/lib/api.ts`
- ✅ Updated `searchConsultants` interface to use `country` and `city` parameters
- ✅ Modified query string building to include country and city separately

## 📋 Required Database Migration

### **Action Required: Run the Migration Script**

A migration SQL script has been created at:
```
database/migration-location-to-country-city.sql
```

This script will:
1. Add `country` and `city` columns to the `missions` table
2. Add `country` and `city` columns to the `consultant_search_requests` table
3. Migrate existing `location` data (split by comma)
4. Add performance indexes
5. Optionally drop old `location` columns

### **How to Run the Migration:**

```bash
# Connect to your MySQL/MariaDB database
mysql -u your_username -p your_database_name

# Run the migration script
source database/migration-location-to-country-city.sql

# Or using redirection:
mysql -u your_username -p your_database_name < database/migration-location-to-country-city.sql
```

### **Rollback Instructions:**
If you need to rollback, the rollback commands are included in the migration script comments.

## 🔄 Complete Change Summary

### Frontend Changes (All Completed ✅)

1. **New Components:**
   - `src/hooks/useCountriesAndCities.ts` - Fetches countries/cities from API
   - `src/components/forms/CountryCitySelector.tsx` - Reusable selector component

2. **Updated Forms:**
   - `CompanyRegistrationForm.tsx` - Uses CountryCitySelector
   - `ConsultantRegistrationForm.tsx` - Uses CountryCitySelector
   - `MissionPostForm.tsx` - Uses CountryCitySelector, field changed: `location` → `country` + `city`
   - `ConsultantSearchForm.tsx` - Uses CountryCitySelector, field changed: `location` → `country` + `city`

3. **Updated API Service:**
   - `src/lib/api.ts` - searchConsultants now sends country/city separately

### Backend Changes (All Completed ✅)

1. **Controllers:**
   - `mission.controller.js` - Accepts country/city in createMission
   - `consultant.controller.js` - Accepts country/city in searchConsultants

2. **Database:**
   - Migration script created (needs to be run)

## 📊 Data Structure Changes

### Before:
```javascript
// Mission Form
{
  location: "Paris, France"
}

// Search Form
{
  location: "Casablanca, Maroc"
}
```

### After:
```javascript
// Mission Form
{
  country: "France",
  city: "Paris"
}

// Search Form
{
  country: "Morocco",
  city: "Casablanca"
}
```

## 🔍 Testing Checklist

### Before Running the App:

- [ ] Run the database migration script
- [ ] Verify the migrations table was updated successfully
- [ ] Check that existing data was migrated correctly

### After Running the App:

- [ ] Test company registration with country/city selection
- [ ] Test consultant registration with country/city selection
- [ ] Test mission posting with country/city selection
- [ ] Test consultant search with country/city filters
- [ ] Verify data is correctly saved in the database
- [ ] Check that cities load when country is selected
- [ ] Test form validation (required fields)
- [ ] Test API error handling (if Countries Now API is down)

## ⚠️ Important Notes

1. **Countries Now API:**
   - Endpoint: `https://countriesnow.space/api/v0.1/countries`
   - Free to use, no API key required
   - Returns all countries with their cities
   - Consider caching this data to reduce API calls

2. **Data Migration:**
   - Existing `location` data will be split by comma
   - Format: "City, Country" → { city: "City", country: "Country" }
   - Review migrated data for accuracy
   - Some entries might not split correctly (no comma, multiple commas, etc.)

3. **Backward Compatibility:**
   - The migration script keeps the old `location` column initially (commented out)
   - Uncomment the DROP COLUMN statements only after verifying the migration
   - This allows for rollback if needed

## 🚀 Next Steps

1. **Run the migration script** (see instructions above)
2. **Start the backend server:**
   ```bash
   cd server
   node index.js
   ```
3. **Start the frontend:**
   ```bash
   npm run dev
   ```
4. **Test all forms** with the new country/city selectors
5. **Verify database entries** contain correct country/city data

## 📞 Troubleshooting

### Issue: Cities not loading
- Check browser console for API errors
- Verify Countries Now API is accessible
- Check network tab for API response

### Issue: Database errors
- Ensure migration script ran successfully
- Check that columns exist: `DESCRIBE missions;`
- Verify data types match

### Issue: Form submission fails
- Check backend console logs
- Verify controller is receiving country and city
- Check SQL query syntax

## 💡 Future Enhancements

1. Add localStorage caching for countries/cities data
2. Implement fallback to static data if API fails
3. Add city search/autocomplete for long city lists
4. Consider pre-loading data on app initialization
5. Add data validation (ensure city belongs to selected country)

---

**Status:** ✅ All code changes completed, database migration script ready
**Action Required:** Run database migration script before testing
