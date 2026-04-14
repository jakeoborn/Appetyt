# Dim Hour — iOS App Feasibility Assessment

**Date:** 2026-03-20
**Current Stack:** Vanilla HTML/CSS/JS, Netlify Functions, Claude API

## Summary

**Yes, an iOS app is feasible.** The existing web app is already mobile-first (430px max-width, touch-optimized, viewport-locked). There are three viable paths, each with increasing effort and capability.

---

## Option 1: Progressive Web App (PWA) — Lowest Effort

**What it is:** Add a manifest + service worker so users can install the app to their home screen directly from Safari.

**What's needed:**
- `manifest.json` (app name, icons, theme color, display: standalone)
- Service worker for offline caching
- Apple-specific meta tags (`apple-mobile-web-app-capable`, splash screens)
- App icons in required sizes (180x180, 192x192, 512x512)

**Pros:**
- Minimal code changes — your existing app stays as-is
- No App Store review process
- Works on Android too
- Instant updates (no app store delay)

**Cons:**
- No push notifications on iOS (limited support)
- No App Store discoverability
- Some users don't know about "Add to Home Screen"

**Estimated effort:** 1-2 days

---

## Option 2: Capacitor (Native Wrapper) — Best Balance

**What it is:** Wrap the existing web app in a native iOS shell using Capacitor (by the Ionic team). Your web code runs inside a WKWebView with access to native APIs.

**What's needed:**
- Install Capacitor and initialize iOS project
- Configure `capacitor.config.ts`
- Add native plugins as needed (push notifications, haptics, etc.)
- Xcode project for building/signing
- Apple Developer account ($99/year)

**Pros:**
- Full App Store presence
- Access to native APIs (push notifications, camera, haptics, biometrics)
- Keep existing codebase — minimal rewrite
- Single codebase for web + iOS + Android

**Cons:**
- Requires Xcode and macOS for building
- WKWebView performance (fine for content apps like Dim Hour)
- App Store review process

**Estimated effort:** 1-2 weeks

---

## Option 3: Native Rewrite (Swift/SwiftUI or React Native) — Most Effort

**What it is:** Rebuild the entire app using native iOS technologies.

**Pros:**
- Best possible performance and native feel
- Full access to all iOS capabilities
- Smooth animations and transitions

**Cons:**
- Complete rewrite of all UI, logic, and data handling
- Separate codebase to maintain alongside web
- Significantly more development time

**Estimated effort:** 4-8 weeks

---

## Recommendation

**Start with PWA** (Option 1) for immediate results — your app already looks and feels native on mobile. Then move to **Capacitor** (Option 2) when you want App Store distribution and push notifications. A full native rewrite (Option 3) is unnecessary given Dim Hour is a content-driven app where WebView performance is more than sufficient.

---

## Architecture Notes

- The Netlify serverless functions (concierge, morning-brief) work identically from a native wrapper — no backend changes needed
- The single-file `index.html` architecture is compatible with all three approaches
- The Claude API integration via serverless functions means API keys stay server-side regardless of approach
