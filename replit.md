# ConnectAid AI - Emergency Response Platform

## Overview
ConnectAid AI is a next-generation emergency response platform that uses Google Gemini AI, Google Maps, and voice technology to connect people in distress with real responders in real-time.

## Features
- **AI-Powered Emergency Categorization**: Google Gemini 2.5 Flash analyzes emergency messages and categorizes them (medical, police, mental health, disaster)
- **Real-Time Responder Location**: Google Maps Places API finds and ranks nearby emergency responders
- **Voice-First Interface**: Web Speech API for voice input and AI text-to-speech feedback
- **Multilingual Support**: AI detects language and translates emergency messages
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

## Recent Changes
- ✅ Complete MVP implementation with all core features
- ✅ Google Gemini AI emergency categorization (verified working via logs and tests)
- ✅ Cinematic splash screen with animated logo intro (slides in and unblurs)
- ✅ Global navigation header with dropdown menu (About, Settings)
- ✅ Enhanced multilingual support - AI detects language and responds in user's language
- ✅ Multilingual text-to-speech with automatic language detection
- ✅ Settings page with voice, appearance, and accessibility preferences
- ✅ About page with mission statement and feature highlights
- ✅ Google Maps/Places API responder location (requires Places API (New) enablement in Google Cloud Console)
- ✅ Web Speech API for voice recognition and text-to-speech
- ✅ Cinematic UI with Framer Motion animations and particle effects
- ✅ Dual persistence: Backend MemStorage + localStorage sync
- ✅ Complete emergency flow: text/voice input → AI categorization → responder search → alert creation
- ✅ Profile management with backend API integration
- ✅ Admin dashboard with real-time alert monitoring
- ✅ End-to-end testing passed successfully

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
