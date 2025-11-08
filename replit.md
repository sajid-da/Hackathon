# ConnectAid AI - Emergency Response Platform

## Overview
ConnectAid AI is a next-generation emergency response platform that uses Google Gemini AI, Google Maps, and voice technology to connect people in distress with real responders in real-time.

## Features
- **AI-Powered Emergency Categorization**: Google Gemini 2.5 Flash analyzes emergency messages and categorizes them (medical, police, mental health, disaster, finance)
- **India-Specific Mock Responder Database**: Comprehensive mock database with 15 Delhi-based responders (AIIMS, Safdarjung Hospital, Delhi Police, NIMHANS, NDRF, RBI Consumer Education, etc.) with accurate India locations and phone numbers
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
- ✅ **Real-World Google Places API Integration**: Replaced mock database with live Google Maps Places API for real emergency responders in India (20km radius, India region bias)
- ✅ **Indian Voice Accents**: Updated TTS to prioritize Indian English voices (Neerja, Aditi for English; Sangeeta for Hindi) with slower rate (0.95) for empathy
- ✅ **Animated Emergency Backgrounds**: Category-specific animations (medical: red pulse, police: blue glow, mental health: teal light, disaster: orange waves, finance: amber glow)
- ✅ **Waveform Voice Visualization**: Real-time waveform animation synchronized with AI speech output
- ✅ **Enhanced Empathy**: More compassionate AI messaging throughout emergency flow with warm, reassuring guidance
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
- AI automatically detects user's language from emergency message
- Gemini responds with categorization and actions in detected language
- Text-to-speech uses detected language code for voice synthesis
- Supported languages: English, Spanish, French, German, Chinese, Arabic, Hindi, Portuguese, Japanese, Korean, Italian, Russian, and more
- Settings allow users to set preferred language override

### User Settings (localStorage persistence)
- **Voice**: Enable/disable, volume control
- **Appearance**: Dark mode toggle
- **Accessibility**: High contrast mode, reduced motion
- **Language**: Preferred language selection (auto-detect or manual)
- **Notifications**: Emergency alert preferences

### Navigation
- Global header on all pages with Home, Emergency, Profile, Dashboard links
- Dropdown menu with About, Settings, and replay intro animation
- Proper semantic HTML using Button with `asChild` for accessibility
- Active page highlighting in navigation
