# Multi-language Support Implementation

## Overview
Implemented dynamic translation using the [LibreTranslate API](https://libretranslate.com/). Users can switch between French (default), English, and Arabic.

## Components Created

### 1. **LanguageContext (`src/contexts/LanguageContext.tsx`)**
- Manages global language state (`fr`, `en`, `ar`).
- Provides `translateText` function to call the API.
- Implements in-memory caching to reduce API calls and improve performance.
- Handles RTL direction switching for Arabic.

### 2. **Translate Component (`src/components/utils/Translate.tsx`)**
- A utility component that wraps text.
- Automatically fetches translation when language changes.
- Displays original text while loading or on error.
- **Usage**: `<Translate text="Bonjour" />`

### 3. **LanguageSelector (`src/components/layout/LanguageSelector.tsx`)**
- Dropdown component to select the active language.
- Integrated into the top navigation bar.

## Integration Details

- **App Wrapping**: `App.tsx` is wrapped with `LanguageProvider`.
- **Navbar**: `CircularNavbar` now includes the `LanguageSelector` and translates navigation items.
- **Hero Section**: `HeroSection` text content is wrapped in `<Translate />` components.

## API Notes
- Uses `https://libretranslate.com/translate` endpoint.
- **Rate Limits**: The public instance has rate limits. If heavily used, consider self-hosting LibreTranslate or acquiring an API key.
- **Caching**: Translations are cached in the session (memory) to avoid re-fetching same strings.

## Next Steps
- Wrap remaining pages and components with `<Translate />` tags.
- Persist language preference in `localStorage`.
- Add error handling UI if translation service is down.
