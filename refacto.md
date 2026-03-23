You are building a tailor shop management application using Laravel (API backend) and React (frontend). The app already has: login, client list with CRUD (measurements, contact info, sewing model photos, fabric), and an admin panel for user/tailor management.
You must now extend this app significantly. Follow every specification below precisely.

# 1. Authentication & Registration

## Two registration methods

Support both email and phone number as unique identifiers for login and signup.

Phone login must support OTP verification (SMS-based or a stub for now).
Email login uses standard password-based auth with email verification.
Both flows must land on the same dashboard after login.

## Two registration entry points

### Entry 1 — Public self-registration (landing page)

Show a landing/welcome screen when the app is opened unauthenticated.
Allow any tailor to register themselves directly (for those who are tech-literate).
Fields: full name, phone number OR email, password, profile photo (optional), city/region.

### Entry 2 — Admin-created account

The admin can create tailor accounts from the admin panel.
This is designed for illiterate or non-tech-savvy tailors.
Admin fills in the tailor's info; the tailor only needs to log in later (with phone or a PIN).
Admin can set a temporary PIN or password for the tailor.

## Auth implementation

Use Laravel Sanctum for token-based auth.
Store tailor_id in the users table for role scoping.
Roles: admin, tailor.
Guard routes: tailors can only access their own data; admin can access all.

# Database Schema Updates

users table (tailors)

id, name, email (nullable), phone (nullable), password, pin (nullable),
role (enum: admin|tailor), profile_photo, city, active, created_at

clients table (already exists, ensure it has tailor_id)
or use it if it is better than the current table
id, tailor_id (FK → users), full_name, phone, email, address, photo,
measurements (JSON), notes, created_at, updated_at

Each tailor only sees clients where tailor_id = auth()->id().

events table
id, name (string), type (enum: general|korite|tabaski|gammu|magal|
  mariage|bapteme|anniversaire|autre),
date (date), description, is_recurring (bool), created_at

Pre-seed with recurring Islamic/cultural events (Korite, Tabaski, Gammu, Magal) and keep date updatable each year.

table (commandes)
id, tailor_id (FK), client_id (FK), event_id (FK, nullable → defaults to "general"),
fabric_description, model_photo, status (enum: pending|in_progress|ready|delivered|cancelled),
price, deposit_paid, due_date, notes, created_at, updated_at

event_clients pivot (optional denormalization)
Alternatively, the orders table alone is sufficient since it links client + event + tailor.

# 3. Event Management

## Public events (managed by admin)

Admin can create, edit, delete events.
Events have a name, type, date, and optional description.
Recurring events (Korite, Tabaski, etc.) auto-appear each year — admin only needs to update the date.
Events are shared across all tailors but orders are tailor-scoped.

## Tailor event view

Each tailor sees upcoming events and which clients have orders attached to each.
Events sorted by date ascending; past events shown in a collapsible "history" section.
A "General" default event always exists for orders not tied to a specific occasion.

## Event-client-order flow

When a tailor creates an order:

Select client (from their own client list).
else create new client (with name, phone, email, address, photo, measurements, notes).
Select event (from shared event list, or "General").
Fill order details (fabric, model photo, price, due date, status).
Save → the order links client + event + tailor.

# 4. Client Management (Updated)

## Client list view

Filter clients by: event, order status, name search.
Each client card shows: photo, name, phone, active orders count, next event deadline.
Badge indicator if a client has an order due within 7 days.

## Client detail page

Tabs or sections:

Profile: name, photo, phone, email, address, notes.
Measurements: structured fields (chest, waist, hips, shoulder width, arm length, inseam, neck, etc.) — editable inline.
Style & Fabric: photos of sewing models, fabric color/type, references.
Orders: list of all orders for this client, with event name, status, due date, price.
History: past delivered/cancelled orders.

## CRUD operations

Create, edit, delete clients (scoped to tailor).
Upload multiple photos per client (model photos, fabric swatches).
Measurements editable via a clean form with clear field labels.

# 5. Statistics & Dashboard

## Tailor dashboard stats

Total clients
Active orders (by status: pending / in progress / ready / delivered)
Revenue this month (sum of prices from delivered orders)
Upcoming deadlines (orders due in next 14 days, sorted)
Orders by event (bar or donut chart)
Orders by status (pie or progress bars)
Recent activity feed (last 5 orders created/updated)

## Admin global stats

Total tailors (active / inactive)
Total clients across all tailors
Total orders across all tailors (by status)
Revenue aggregated across all tailors
Most active tailors (top 5 by order count)
Upcoming events with order volumes per event

## Charting library

Use Recharts (already works in React) for all charts. Keep them clean and minimal.

# 6. UI / UX — Design System

## Philosophy

The design must feel like it was made by a senior frontend developer with a personal design sensibility — not a generic AI-generated app. Avoid Material UI defaults. Create a distinctive visual identity using tailwind and others libraries, no icons needed (just if necessary or looks like couture emoji).

## Color palette

Define a design token system with these base colors:

Primary: deep terracotta / warm earth tone — #C4622D (light) / #E8855A (dark)
Accent: muted gold — #D4A843
Surface light: #FAF7F2 (warm off-white background)
Surface dark: #1A1714 (very dark warm brown, not pure black)
Card light: #FFFFFF with box-shadow: 0 1px 3px rgba(0,0,0,0.08)
Card dark: #252119
Text primary light: #1C1917
Text primary dark: #F5F0E8
Text secondary: #78716C
Success: #4CAF7D, Warning: #E5A023, Danger: #D95040
Border light: rgba(0,0,0,0.08), Border dark: rgba(255,255,255,0.08)

## Typography

Font: Inter (Google Fonts) — already familiar but pair with Playfair Display for headings (gives cultural elegance).
Heading: Playfair Display, 500–700 weight.
Body: Inter, 400/500.
Sizes: 12 / 14 / 16 / 20 / 24 / 32 / 40px scale.

## Components style rules

Cards: border-radius: 16px, subtle shadow, no hard borders.
Buttons: border-radius: 10px, primary = terracotta fill, secondary = ghost with terracotta border.
Inputs: border-radius: 10px, focus ring in terracotta at 40% opacity, label above (not placeholder-as-label).
Sidebar: fixed left, 240px wide, dark by default (dark brown), with warm icon tints. Logo at top, nav items with hover state (terracotta left bar + background tint).
Status badges: rounded pills with semantic colors (pending = amber, in_progress = blue, ready = green, delivered = gray, cancelled = red).
Avatar: circular photo with initials fallback in terracotta.
Tables: alternating row backgrounds, no hard grid lines — only horizontal separators.
Empty states: illustrated with a custom SVG icon + helpful message + CTA button.

## Micro-interactions

Skeleton loaders on all data fetches.
Toast notifications (top-right, auto-dismiss 4s) for all CRUD success/error.
Smooth page transitions (React Router + Framer Motion or CSS transitions).
Hover elevations on cards (transform: translateY(-2px), transition 150ms ease).
Form field validation inline (not just on submit).

## 7. Dark / Light Mode

### Implementation

Use a ThemeContext in React with localStorage persistence.
Toggle button in the top navbar (sun/moon icon).
Use CSS custom properties (var(--color-background), var(--color-text), etc.) defined on :root and [data-theme="dark"].
All components use only CSS variables — no hardcoded colors anywhere.
Transition: transition: background-color 200ms ease, color 200ms ease on body.

## Tailwind config (if using Tailwind)

Use darkMode: 'class' and toggle dark class on <html>.
Define all custom colors in tailwind.config.js with light/dark variants.

## 8. Authorization & Data Scoping

### Laravel policies

ClientPolicy: tailor can only view/edit/delete own clients.
OrderPolicy: tailor can only view/edit/delete own orders.
EventPolicy: all authenticated users can read; only admin can write.
UserPolicy: only admin can manage users.

### API middleware

All /api/tailor/*routes protected by auth:sanctum + role:tailor middleware.
All /api/admin/* routes protected by auth:sanctum + role:admin middleware.
Always inject tailor_id = auth()->id() server-side when creating clients/orders — never trust a tailor_id from the request body.

## 9. Navigation Structure

### Tailor sidebar nav

Dashboard (stats overview)
My Clients
Events & Orders
Calendar (optional: upcoming deadlines view)
My Profile / Settings

### Admin sidebar nav

Overview (global stats)
Manage Tailors
Manage Events
All Orders (cross-tailor)
Settings

## 10. Additional Features (Recommended)

### Deadline & reminder system

On the dashboard, show a "Due this week" widget with orders sorted by due_date.
Badge count on the nav item for orders due in 48h.
: push notification (we are using pwa so add it if its possible) / SMS reminder (if its possible or send whatsapp message).

use cache with redis for better performance. (very important)

### Order status kanban (optional)

A kanban board view on the "Orders" page: columns = status, cards = orders.
Drag-and-drop to change status (using @dnd-kit/core).

### Search

Global search bar in the top navbar.
Searches across clients (name, phone) and orders (client name, event name, status).

### Print / export

Print a client's measurement sheet as a clean PDF (using react-to-print or a Laravel PDF route).
Export client list to CSV from admin panel.

### Onboarding flow

First time a tailor logs in, show a 3-step onboarding modal: complete profile → add first client → create first event/order.

### tests

add tests for all the features using pest and react testing library. (very important)

## 11. Tech Stack Reminders

Backend: Laravel , Sanctum auth, RESTful API, Spatie Laravel Permission (roles), Laravel Media Library (photos).
Frontend: React , React Router , Axios, Recharts, Zustand or Redux Toolkit (state), React Query (server state), Tailwind CSS or CSS Modules with custom properties.
Storage: Local disk or (future) S3 for photos.
Database: sqlite but in prod postGres.

### Deliverables Expected

Updated Laravel migrations for all tables above.
Laravel API routes + controllers + policies (fully scoped).
React component tree with the described design system.
Theme system (light/dark) fully implemented.
All CRUD flows for clients, orders, events — working end to end.
Dashboard with charts for both tailor and admin roles.
Auth flows: self-registration + admin-created accounts, phone + email.
