# ConnectAid AI - Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from emergency/critical apps like Citizen, Noonlight, and premium fintech apps like Stripe for trust and clarity under stress. Cinematic aesthetic with functional restraint.

## Core Design Principles
- **Empathy First:** High-contrast, stress-optimized UI that works in crisis situations
- **Voice-First Accessibility:** Large touch targets, minimal cognitive load
- **Cinematic Premium:** Movie-quality animations balanced with instant functionality
- **Adaptive Color Psychology:** Context-aware color schemes signal emergency type

## Typography
- **Primary Font:** Inter or DM Sans (via Google Fonts CDN)
- **Hierarchy:**
  - Hero Headlines: text-5xl to text-7xl, font-bold, tracking-tight
  - Section Titles: text-3xl to text-4xl, font-semibold
  - Body Text: text-base to text-lg, font-normal, leading-relaxed
  - Button Text: text-base, font-semibold, uppercase tracking-wide
  - Voice Feedback: text-xl, font-medium (high readability during stress)

## Layout System
**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-8, mt-12, py-24)

**Breakpoint Strategy:**
- Mobile-first with full-width cards
- Desktop: max-w-7xl containers with strategic whitespace

## Component Library

### Landing Page
- **Hero Section:** Full viewport (min-h-screen) with layered animated gradient background (deep blue → crimson → amber using CSS gradients + Framer Motion)
- **Central CTA:** Extra-large "Get Help" button (px-16 py-6) with soft glow effect (box-shadow with blur)
- **Particle Overlay:** Ambient floating particles using Framer Motion, subtle opacity (20-40%)
- **Background Treatment:** Video overlay option with low opacity (0.3) or pure gradient animation

### Emergency Flow Page
- **Voice Input Area:** Prominent circular pulse animation indicating active listening (Framer Motion scale + opacity)
- **Response Cards:** Responder cards with Google Maps integration showing distance, name, type with icons (Heroicons)
- **Progress Indicator:** Multi-step visual progress with adaptive color (red/medical, blue/police, green/mental health)
- **AI Feedback Zone:** Speech bubble design with typing indicator animation

### Profile Page
- **Card-Based Layout:** Elevated cards (shadow-lg) with rounded-2xl borders
- **Emergency Contacts:** List view with quick-access buttons
- **Alert History:** Timeline design with color-coded emergency type badges

### Control Panel (Admin Dashboard)
- **Grid Layout:** 3-column grid (lg:grid-cols-3) for active alerts
- **Filter Tabs:** Pill-style tabs with active state indicators
- **Real-time Updates:** Pulsing badge indicators for new alerts

## Animations (Framer Motion)
- **Page Transitions:** Fade + slide (y: 20 → 0, opacity: 0 → 1, duration: 0.4s)
- **Button Hovers:** Scale (1 → 1.05) + glow intensification
- **Emergency Button:** Persistent subtle pulse (scale: 1 → 1.03 → 1, repeat: Infinity)
- **Particle Effects:** Slow drift animation (x/y translation, duration: 15-30s)
- **Voice Active State:** Ripple/pulse from center (scale circles, stagger delay)

## Color System (Adaptive)
**Base Neutrals:** bg-slate-950, bg-slate-900, text-slate-100, text-slate-400

**Context Colors:**
- Medical Emergency: red-600 to red-500 (buttons), red-900/20 (backgrounds)
- Police/Security: blue-600 to blue-500, blue-900/20
- Mental Health: green-600 to green-500, green-900/20
- Disaster: amber-600 to amber-500, amber-900/20

**Interactive States:**
- Primary buttons use adaptive emergency color with hover brightness increase
- Focus rings: ring-2 ring-offset-2 with emergency color

## Accessibility Features
- Minimum 44px touch targets for all interactive elements
- WCAG AAA contrast ratios (7:1) for critical text
- Reduced motion support (@media prefers-reduced-motion)
- Large, readable fonts (minimum 16px base)
- Voice feedback accompanies all critical actions

## Icons
**Library:** Heroicons via CDN (outline for navigation, solid for actions)
**Emergency Icons:** Extra-large (h-12 w-12 to h-16 w-16) with colored backgrounds

## Images
**Hero Section:** Optional cinematic background video/image (emergency responders in action, blurred/darkened with overlay). If used, apply dark overlay (bg-black/60) for text contrast.

**Responder Cards:** Map thumbnails from Google Maps Static API showing location pins

**Profile/Dashboard:** Placeholder avatars, no decorative imagery to maintain focus

## Special Treatments
- **Glow Effects:** Liberal use of colored box-shadows (0 0 40px rgba(color, 0.5)) on primary CTAs
- **Glass Morphism:** backdrop-blur-lg with bg-white/10 for overlay cards
- **Gradient Borders:** Use gradient backgrounds clipped to borders for premium feel
- **Ambient Backgrounds:** Radial gradients with multiple color stops for depth