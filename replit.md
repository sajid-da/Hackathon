# ConnectAid AI - Emergency Response Platform

## Overview
ConnectAid AI is a next-generation emergency response platform that uses Google Gemini AI, Google Maps, and voice technology to connect people in distress with real responders in real-time.

## Features
- **AI-Powered Emergency Categorization**: Google Gemini 2.5 Flash analyzes emergency messages and categorizes them (medical, police, mental health, disaster, finance)
- **Real-World Responder Search**: Google Places API integration for real nearby facilities (20km radius, India region bias)
- **Intelligent Mock Fallback**: Comprehensive mock database with 15 Delhi-based responders (AIIMS, Safdarjung Hospital, Delhi Police, NIMHANS, NDRF, RBI Consumer Education, etc.) automatically used when Places API unavailable
- **Accurate User Location**: Browser geolocation API gets real user location (defaults to Delhi if unavailable)
- **Smart Responder Matching**: Finds 2-3 nearest facilities based on emergency type with Haversine distance calculation and priority messaging
- **Government Warning System**: Official disclaimer on emergency page warning users this is government-affiliated and should only be used in real emergencies
- **Clickable Emergency Type Buttons**: Landing page buttons (Medical, Police, Mental Health, Disaster, Finance) navigate to emergency page with pre-selected type
- **Voice-First Interface**: Web Speech API for voice input and AI text-to-speech feedback with priority responder announcements
- **Multilingual Support**: AI detects language and responds in user's language with priority messaging translated
- **User Authentication**: Login system with name, phone, and email for personalized emergency response
- **User Profiles**: Emergency contact management and medical information storage
- **Admin Dashboard**: Real-time alert monitoring and filtering by emergency type

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Web Speech API
- **Backend**: Node.js, Express
- **AI**: Google Gemini 2.5 Flash
- **Maps**: Google Maps JavaScript API, Places API
- **Storage**: In-memory storage (localStorage for user data persistence)

## Architecture
### Data Models
- **Users**: Profile information, emergency contacts, medical info
- **Alerts**: Emergency messages, categorization, location, assigned responders
- **Responders**: Nearby facilities with location, distance, contact info

### API Endpoints
- `POST /api/emergency/categorize` - Categorize emergency using Gemini AI
- `GET /api/emergency/responders` - Find nearby responders using Google Maps
- `POST /api/alerts` - Create new alert
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/user/:userId` - Get user's alerts
- `PATCH /api/alerts/:id/status` - Update alert status
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user

## Pages
1. **Landing Page** (`/`) - Cinematic animated hero with emergency type categories
2. **Emergency Flow** (`/emergency`) - Voice/text input, AI categorization, responder results
3. **Profile Page** (`/profile`) - User information and emergency contacts management
4. **Dashboard** (`/dashboard`) - Admin control panel with alert monitoring

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key (with VITE_ prefix for frontend access)
- `SESSION_SECRET` - Session secret for authentication

## Recent Changes (Latest First)
- ✅ **Nearest Responder Alert System**: Clear visual alerts on the closest responder - pulsing "NEAREST RESPONDER" badge, red border with glow effect, highlighted distance in red, priority call button with 🚨 emoji, "Closest" tag
- ✅ **Auto Location Detection**: Automatically requests user's geolocation on page load for accurate nearby responders (with user permission)
- ✅ **Intelligent Mock Fallback System**: Automatic fallback to comprehensive mock responder database when Places API unavailable (15 Delhi-based facilities across all 5 emergency categories)
- ✅ **Comprehensive Multilingual Support**: Full internationalization for all UI elements (English, Hindi, Kannada, Tamil, Telugu, Spanish) with automatic language detection from user message, all buttons, labels, messages, and dialogs adapt to detected language
- ✅ **Enhanced Geolocation**: High-accuracy geolocation (enableHighAccuracy, 10s timeout) to detect actual user location (Bangalore, Delhi, Mumbai, etc.) with clear messaging if location services disabled
- ✅ **Real-World Google Places API Integration**: Live Google Maps Places API for real emergency responders in India (20km radius, India region bias) with intelligent mock fallback
- ✅ **Indian Voice Accents**: Updated TTS to prioritize Indian English voices (Neerja, Aditi for English; Sangeeta for Hindi) with slower rate (0.95) for empathy
- ✅ **Animated Emergency Backgrounds**: Category-specific animations (medical: red pulse, police: blue glow, mental health: teal light, disaster: orange waves, finance: amber glow)
- ✅ **Waveform Voice Visualization**: Real-time waveform animation synchronized with AI speech output
- ✅ **Enhanced Empathy & Call Confirmation**: More compassionate AI messaging throughout emergency flow with warm, reassuring guidance, plus AlertDialog confirmation before calling responders with empathetic copy and responder details
- ✅ **India Localization**: Updated all mock responders to Delhi, India locations (AIIMS, Safdarjung, Delhi Police, etc.)
- ✅ **Accurate Geolocation**: Browser geolocation API gets real user location (defaults to Delhi coordinates 28.6139, 77.2090)
- ✅ **Government Warning**: Official disclaimer on emergency page with India emergency numbers (112, 100)
- ✅ **Clickable Emergency Buttons**: Landing page category buttons (Medical, Police, Mental Health, Disaster, Finance) now clickable and navigate with pre-selected type
- ✅ **Finance Category Added**: New Finance emergency category with Indian Rupee icon, 3 Delhi-based responders (RBI, Consumer Disputes Commission, Financial Literacy Centre), full Gemini AI support, and amber color theme
- ✅ Complete MVP implementation with all core features
- ✅ Mock responder database with 15 realistic emergency responders across all 5 categories (medical: 3, police: 3, mental_health: 3, disaster: 3, finance: 3)
- ✅ Smart responder search returning 2-3 nearest facilities with distance calculation
- ✅ Priority messaging system highlighting closest responder in user's language
- ✅ Enhanced voice output announcing both AI response and priority responder in detected language
- ✅ User authentication system with login page (name, phone, email)
- ✅ Protected routes requiring authentication for emergency features
- ✅ Logout functionality in header dropdown menu
- ✅ Google Gemini AI emergency categorization (verified working via logs and tests)
- ✅ Cinematic splash screen with animated logo intro (slides in and unblurs)
- ✅ Global navigation header with dropdown menu (About, Settings, Logout)
- ✅ Enhanced multilingual support - AI detects language and responds in user's language
- ✅ Multilingual text-to-speech with automatic language detection
- ✅ Settings page with voice, appearance, and accessibility preferences
- ✅ About page with mission statement and feature highlights
- ✅ Web Speech API for voice recognition and text-to-speech
- ✅ Cinematic UI with Framer Motion animations and particle effects
- ✅ Dual persistence: Backend MemStorage + localStorage sync
- ✅ Complete emergency flow: text/voice input → AI categorization → responder search → alert creation
- ✅ Profile management with backend API integration
- ✅ Admin dashboard with real-time alert monitoring

## User Preferences
- Premium, cinematic design with high-contrast UI
- Voice-first accessibility with multilingual support
- Adaptive color schemes based on emergency type
- Smooth animations and micro-interactions
- Ethical AI principles and disability-friendly design
- Accessibility features: high contrast mode, reduced motion, keyboard navigation, screen readers

## Implementation Notes
### Accessibility
- **Skip to Main Content**: Keyboard users can press Tab to skip navigation
- **Focus Indicators**: 3px outline with 2px offset on all focusable elements
- **High Contrast Mode**: Toggle in Settings for maximum text/background contrast
- **Reduced Motion**: Respects system preferences and user settings
- **Screen Reader Support**: Semantic HTML, ARIA labels, proper heading hierarchy
- **Keyboard Navigation**: All features accessible without mouse

### Multilingual Support
- **Automatic Language Detection**: System detects user's language from their emergency message text (supports English, Hindi, Kannada, Tamil, Telugu, Spanish)
- **Full UI Translation**: ALL interface elements adapt to detected language:
  - Button labels (Submit, Call Now, Get Directions, Cancel, etc.)
  - Page titles and headings (Emergency Response, Analyzing Emergency, etc.)
  - Instructions and descriptions (placeholder text, warnings, guidance)
  - Dialog messages (call confirmation, government warnings)
  - Error messages and toasts
- **Gemini AI**: Responds with categorization and actions in detected language
- **Text-to-Speech**: Uses detected language code for voice synthesis with Indian accent priority
- **Translation System**: Centralized translation utility (`client/src/lib/translations.ts`) with comprehensive vocabulary for emergency response
- **Supported Languages**:
  - **en** (English) - Default
  - **hi** (Hindi) - हिन्दी
  - **kn** (Kannada) - ಕನ್ನಡ (Bangalore region)
  - **ta** (Tamil) - தமிழ்
  - **te** (Telugu) - తెలుగు
  - **es** (Spanish) - Español

### Location Detection
- **High-Accuracy Geolocation**: Browser geolocation API with `enableHighAccuracy: true` for precise coordinates
- **Automatic City Detection**: Detects user's actual city (Bangalore, Delhi, Mumbai, Chennai, Hyderabad, etc.)
- **Real Nearby Responders**: Shows emergency services within 20km of user's actual location
- **Timeout Handling**: 10-second timeout with clear error messaging if location unavailable
- **Fallback Behavior**: Falls back to Delhi coordinates (28.6139, 77.2090) only if geolocation completely fails or is denied
- **User Messaging**: Clear prompts asking users to enable location services for accurate responder matching

### User Settings (localStorage persistence)
- **Voice**: Enable/disable, volume control
- **Appearance**: Dark mode toggle
- **Accessibility**: High contrast mode, reduced motion
- **Language**: Auto-detected from emergency message (can be overridden in Settings)
- **Notifications**: Emergency alert preferences

### Navigation
- Global header on all pages with Home, Emergency, Profile, Dashboard links
- Dropdown menu with About, Settings, and replay intro animation
- Proper semantic HTML using Button with `asChild` for accessibility
- Active page highlighting in navigation
