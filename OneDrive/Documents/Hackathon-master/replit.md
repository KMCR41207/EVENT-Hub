# College Event Hub

## Overview

A vibrant, editorial-style campus event platform with QR-based attendance. Students discover events, register, and get QR passes. Organizers manage events and track attendance with live dashboards.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Charts**: Recharts
- **Routing**: Wouter

## Features

- **Landing Page**: Aurora mesh gradient background, animated hero, event showcase, club marquee, stats
- **Events Discovery**: Search and filter by category, animated event cards with image hover reveals
- **Event Detail**: Ken Burns hero image, sticky registration sidebar, capacity tracker
- **Student Dashboard**: Bento-grid layout, next event banner with QR code modal
- **Organizer Dashboard**: Live stats, animated bar charts (Recharts), category breakdown, event management table
- **Clubs Directory**: Color-coded club cards per category with member counts

## Visual Design

- Dark theme (#0a0a0f background) with aurora gradients
- Vibrant accent colors: Purple (#6366f1), Pink (#ec4899), Cyan (#06b6d4)
- Fonts: Plus Jakarta Sans (display/headings), Inter (body)
- Spring animations on all interactions via Framer Motion
- Glassmorphism panels, layered shadows, and hover glows

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/college-event-hub run dev` — run frontend locally

## Artifacts

- **college-event-hub**: React/Vite frontend at `/` (port set by env)
- **api-server**: Express API server at `/api` 

## Database Tables

- `clubs` — Campus clubs (name, description, category, memberCount)
- `events` — Events (title, description, date, location, category, capacity, imageUrl, clubId)
- `registrations` — Student registrations with QR codes
- `attendance` — Attendance records marked via QR scan
