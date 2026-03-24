# Profile Type Implementation Summary

## Overview
Added support for three different consultant profile types:
- **Consultant** - Expert conseil en mission
- **Freelance** - Travailleur indépendant  
- **Manager de Transit** - Manager de transition

## Database Changes

### Migration (Auto-runs on server start)
**File**: `server/config/migrations.js`

Added two new migrations:
1. `profile_type` column to `consultants` table
2. `profile_type` column to `consultant_registration_requests` table

**Column Definition**:
```sql
profile_type ENUM('Consultant', 'Freelance', 'Manager de Transit') DEFAULT 'Consultant'
```

## Backend Changes

### 1. Auth Controller
**File**: `server/controllers/auth.controller.js`

- Extract `profile_type` from registration request body
- Store `profile_type` in `consultant_registration_requests` table
- Default to 'Consultant' if not provided

### 2. Admin Controller  
**File**: `server/controllers/admin.controller.js`

- Include `profile_type` when approving consultant registrations
- Transfer `profile_type` from registration request to main consultants table

## Frontend Changes

### 1. Registration Form Interface
**File**: `src/components/forms/ConsultantRegistrationForm.tsx`

**Added**:
- `profile_type` field to `ConsultantFormData` interface
- Profile type selection in Step 1 using `RadioGroup` component
- Three profile type options with descriptions

**UI Component**:
```tsx
<RadioGroup
    label="Type de profil"
    options={[
        { value: "Consultant", label: "Consultant", description: "Expert conseil en mission" },
        { value: "Freelance", label: "Freelance", description: "Travailleur indépendant" },
        { value: "Manager de Transit", label: "Manager de Transit", description: "Manager de transition" },
    ]}
    value={formData.profile_type}
    onChange={(value) => handleChange("profile_type", value)}
    layout="horizontal"
/>
```

### 2. Registration Page
**File**: `src/pages/ConsultantRegister.tsx`

- Append `profile_type` to FormData before submission
- Remove `profile_type` from profile_data JSON (stored separately)
- Default to 'Consultant' if not selected

## File Upload Feature (Bonus)

Also implemented chat file upload functionality:

### Database
- Added `attachment_url` and `attachment_type` columns to `messages` table

### Backend
- Created `server/middleware/upload.middleware.js` for multer configuration
- Updated chat controller to handle file uploads
- Added `/api/chat/messages/attachment` endpoint
- Configured static file serving for `/uploads/chat`

### Frontend
- Updated `ChatWindow.tsx` with file upload UI
- Added file selection and upload handlers
- Display inline images and file links in chat
- Added loading states for uploads

## Testing

### To Test Profile Types:

1. **Start the server** - migrations will run automatically
2. **Navigate to consultant registration** 
3. **Select a profile type** in Step 1
4. **Complete registration**
5. **Admin approves** - profile_type is transferred to main table
6. **Login** - user data includes profile_type

### To Test File Uploads:

1. **Login as consultant or company**
2. **Open a chat conversation**
3. **Click paperclip icon** to upload files
4. **Select file** (max 10MB, images/PDFs/docs)
5. **File uploads and displays** in chat

## Database Schema

### consultants table
```sql
CREATE TABLE consultants (
    id VARCHAR(36) PRIMARY KEY,
    profile_type ENUM('Consultant', 'Freelance', 'Manager de Transit') DEFAULT 'Consultant',
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    ...
);
```

### consultant_registration_requests table
```sql
CREATE TABLE consultant_registration_requests (
    id VARCHAR(36) PRIMARY KEY,
    profile_type ENUM('Consultant', 'Freelance', 'Manager de Transit') DEFAULT 'Consultant',
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    ...
);
```

### messages table
```sql
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    sender_type ENUM('company', 'consultant') NOT NULL,
    content TEXT NOT NULL,
    attachment_url VARCHAR(255) DEFAULT NULL,
    attachment_type VARCHAR(50) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ...
);
```

## Next Steps (Future Enhancements)

1. **Dashboard Filtering**: Filter consultants by profile_type in search/browse
2. **Profile Badges**: Display profile type badges on consultant cards
3. **Analytics**: Track registration/login by profile type
4. **Permissions**: Different features based on profile type
5. **Matching**: Consider profile type in AI matching algorithm

## Files Modified

### Backend
- `server/config/migrations.js`
- `server/controllers/auth.controller.js`
- `server/controllers/admin.controller.js`
- `server/controllers/chat.controller.js`
- `server/routes/chat.routes.js`
- `server/middleware/upload.middleware.js` (new)
- `server/index.js`

### Frontend
- `src/components/forms/ConsultantRegistrationForm.tsx`
- `src/pages/ConsultantRegister.tsx`
- `src/components/chat/ChatWindow.tsx`
- `src/lib/api.ts`

### Other
- `.gitignore` (added server/uploads/)
