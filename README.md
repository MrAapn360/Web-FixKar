# FixKar — Web

Companion **web** version of the FixKar mobile app: a home-services booking platform for Karachi/Pakistan. Customers browse and book electricians, plumbers, carpenters, AC technicians and more; workers manage requests, get paid, and build a rating.

Two folders make up the project:

- `fixkar` — React frontend (this folder)
- `fixkar-backend` — Laravel 12 + MySQL API (sibling folder)

See `ROADMAP.md` for the full build plan and what's been completed in each phase.

## Stack

- **Frontend:** React (Create React App, plain JS), React Router, Axios, plain CSS (no Tailwind)
- **Backend:** Laravel 12, Sanctum (token auth), MySQL
- **Auth:** Sanctum personal access tokens — the frontend stores a Bearer token and sends it on every request

## Prerequisites

- Node.js (v18+) and npm
- PHP 8.2+ and Composer
- MySQL — via XAMPP, Laragon, or a standalone install

## Setup — Backend (`fixkar-backend`)

1. Install dependencies:
   ```
   composer install
   ```
2. Copy `.env.example` to `.env` if you don't already have one, and set:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=fixkar
   DB_USERNAME=root
   DB_PASSWORD=
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:3000
   SANCTUM_STATEFUL_DOMAINS=localhost:3000
   ```
3. Start MySQL (via XAMPP/Laragon control panel) and create a `fixkar` database (or let the next step do it if your MySQL user can create databases).
4. Generate an app key if you don't have one:
   ```
   php artisan key:generate
   ```
5. Run migrations and seed demo data:
   ```
   php artisan migrate --seed
   ```
6. Link the public storage disk (needed for profile photo uploads):
   ```
   php artisan storage:link
   ```
7. Start the API server:
   ```
   php artisan serve
   ```
   Runs at `http://localhost:8000`.

**Demo accounts** (created by the seeder):

| Role     | Email                  | Password   |
|----------|-------------------------|------------|
| Customer | customer@fixkar.test    | password   |
| Worker   | worker@fixkar.test      | password   |

## Setup — Frontend (`fixkar`)

1. Install dependencies:
   ```
   npm install
   ```
2. Environment variables (optional — defaults already point at the local backend). Create a `.env` file if you want to override:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_USE_MOCK=false
   ```
   - `REACT_APP_USE_MOCK=true` (or the flag unset) runs entirely on an in-memory mock API — no backend needed, useful for quick UI work.
   - `REACT_APP_USE_MOCK=false` talks to the real Laravel API above.
3. Start the dev server:
   ```
   npm start
   ```
   Runs at `http://localhost:3000`.

## Running both together

Both servers need to stay running at the same time in separate terminals:

- Terminal 1, in `fixkar-backend`: `php artisan serve`
- Terminal 2, in `fixkar`: `npm start`
- MySQL running in the background (XAMPP/Laragon)

If you see "Network Error" or login failures in the browser, the most common cause is one of these three not running.

## Project structure (frontend)

```
src/
  api/          Axios client, service layer, mock API, static mock data
  components/   Shared UI pieces (Navbar, BookingCard, ReviewForm, PaymentForm, ...)
  context/      AuthContext (session, role, unread notification count)
  pages/        One file per route
```

The service layer (`src/api/services.js`) is the single place components call into — it internally routes to either the mock API or the real backend based on `REACT_APP_USE_MOCK`, so UI code never needs to know which one is active.

## Project structure (backend)

```
app/Http/Controllers/Api/   One controller per resource (Auth, Worker, Booking, Review, Payment, PaymentMethod, Profile, Notification)
app/Models/                  Eloquent models + relationships
database/migrations/         Schema
database/seeders/            Demo workers + demo login accounts
routes/api.php                All API routes, grouped by auth:sanctum middleware
```

## Features

- Browse and search workers by category, city, and keyword
- Worker profiles with ratings, reviews, skills, and hourly rate
- Booking flow: request → accept/reject → start → complete, with cancellation
- Post-completion reviews (rating + tags + comment), feeding into the worker's average rating
- Dummy payments (cash or EasyPaisa) with a 5% platform commission calculated automatically
- Profile editing, photo upload, and account deletion (booking/review/payment history is preserved and de-linked, not deleted)
- In-app notifications for booking and payment events, with a navbar badge that polls every 20 seconds

## Known limitations

- Payments are recorded, not processed — no real payment gateway integration
- Notifications are polled, not pushed (no websockets)
- No admin dashboard (see Phase 11 in `ROADMAP.md` for optional stretch goals)
