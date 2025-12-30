# ConnectAid AI – Emergency Assistance Platform

## Overview
ConnectAid AI is an emergency assistance platform designed to help users quickly identify relevant nearby emergency facilities using AI-powered intent analysis, real-time location awareness, and public data sources.

The platform focuses on speed, accessibility, and clarity to guide users toward appropriate emergency resources.

> ⚠️ Disclaimer  
> ConnectAid AI is **not a replacement for official emergency services** and is **not affiliated with any government or emergency authority**.  
> In life-threatening situations, users must contact official emergency numbers directly (India: 112).

---

## Features

### Emergency Categorization
- AI-powered analysis of user input (text or voice)
- Categorizes emergencies into:
  - Medical
  - Police
  - Mental Health
  - Disaster
  - Financial Emergency and many more.
- Designed to assist decision-making, not diagnosis

### Location-Based Responder Discovery
- Browser-based geolocation (with user permission)
- Finds nearby public emergency facilities
- Distance-based prioritization
- City-aware results based on actual user location

### Fallback Search
- If mapping services are unavailable:
  - AI-assisted web search identifies publicly listed emergency facilities
- Avoids dependency on static mock data

### Voice & Accessibility
- Voice input via Web Speech API
- Text-to-speech responses
- Multilingual support with automatic language detection
- High-contrast mode, reduced motion, and keyboard navigation

### User System
- Basic authentication (name, phone, email)
- Emergency contacts management
- Optional user-provided medical information
- Alert history per user

### Admin Dashboard
- Real-time alert monitoring
- Filtering by emergency type
- Alert status updates

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Web Speech API

### Backend
- Node.js
- Express

### AI
- Google Gemini (emergency intent analysis)

### Maps & Location
- Google Maps JavaScript API
- Google Places API

### Storage
- In-memory backend storage
- Browser localStorage for persistence

---

## Architecture

### Data Models
- **User**
  - Profile details
  - Emergency contacts
  - Optional medical information
- **Alert**
  - Emergency message
  - Category
  - Location
  - Status
- **Responder**
  - Facility name
  - Distance
  - Public contact information

---

## API Endpoints

