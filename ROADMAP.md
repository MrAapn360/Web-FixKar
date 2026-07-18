# FixKar Web — Build Roadmap

Companion **web** version of the FixKar mobile app: a home-services booking platform for Karachi/Pakistan.
Stack: **React (Create React App, plain JS)** frontend + **Laravel 11 + MySQL** backend (Sanctum auth). No Firebase.

This roadmap is the plan Claude and Sam follow together. It tracks what's done, what's next, and how we split the work.

---

## How we work together

- **Claude writes the code** into `D:\WT\SemProject\fixkar` (and later a sibling `fixkar-backend` folder for Laravel).
- **Sam runs it locally** on the laptop: React via `npm start`, Laravel via XAMPP/Laragon + MySQL. Claude can't run your local MySQL, so migrations and `php artisan serve` happen on your machine.
- Claude verifies frontend builds compile in a sandbox before handing off. Backend code is written to be copy-run correct, and we debug together against your real MySQL.
- We go **one phase at a time**. Each phase ends with something you can see or test.

## Decisions locked in

| Choice | Decision |
|---|---|
| Backend runtime | You run it locally (XAMPP/Laragon + MySQL) |
| Build order | **Frontend skeleton first** (mock API), then wire real Laravel backend |
| Styling | Plain CSS (no Tailwind) |
| Auth | Laravel Sanctum tokens; React stores token + calls with Axios interceptor |

---

## Phases

### Phase 0 — Roadmap & setup  ✅ (this doc)

### Phase 1 — Frontend skeleton  ⏳ (in progress)
- Install `react-router-dom` + `axios`.
- Folder structure: `pages/`, `components/`, `context/`, `api/`, `utils/`.
- React Router with every route from the plan (public / customer / worker / shared).
- `AuthContext` + Axios instance with token interceptor.
- **Mock API layer** so the whole frontend runs with fake data before Laravel exists — flip one flag to switch to the real backend later.
- Core pages: Landing, Login, Register, Role selection.
- **You can see:** app runs at `localhost:3000`, you can navigate, "log in" with mock data, pick a role.

### Phase 2 — Worker listing + profile detail (public)
- `/workers` browse + search (filter by category, city, search box).
- `/workers/:id` profile detail (rating, reviews, hourly rate, "Book Now").
- Easiest to demo, no auth needed. Runs on mock data first.

### Phase 3 — Laravel backend skeleton
- `composer create-project laravel/laravel fixkar-backend`, install Sanctum.
- `.env` → your local MySQL. Migrations for all tables (users, worker_profiles, bookings, reviews, payments, payment_methods, notifications).
- Seeder: ~10–15 fake workers so demos aren't empty.
- **You run:** `php artisan migrate --seed`, `php artisan serve`.

### Phase 4 — Auth end-to-end
- register / login / logout / me / select-role endpoints (Sanctum).
- Flip React from mock API to real backend. Auth works for real.

### Phase 5 — Booking flow
- Customer creates booking → worker sees request → accept/reject/start/complete → status updates.
- Customer dashboard + worker dashboard.

### Phase 6 — Reviews
- Leave rating/comment/tags after a completed booking; worker's average rating recalculated in a DB transaction.

### Phase 7 — Payments (dummy) + payment methods
- Record dummy EasyPaisa/cash payment, compute 5% commission, mark booking paid.
- Save/edit EasyPaisa number.

### Phase 8 — Profile + photo upload + delete account
- Edit profile, upload photo (real Laravel `Storage`), delete account (removes only user + worker_profiles, keeps bookings/reviews/payments).

### Phase 9 — Notifications
- In-app notification list, mark read / read-all, simple 15–30s polling.

### Phase 10 — Polish
- Loading states, empty states, responsive CSS, README with setup instructions.

### Phase 11 — Optional stretch (if time allows)
- Admin view, API Resource classes, pagination, richer seed data.

---

## Current status

- [x] Phase 0 — Roadmap
- [ ] Phase 1 — Frontend skeleton  ← **we are here**
- [ ] Phase 2–11

## Your setup checklist (local machine)

1. **Node.js** installed (you have it — CRA is scaffolded).
2. **XAMPP or Laragon** with MySQL running (needed from Phase 3).
3. **Composer** installed (for Laravel, Phase 3).
4. **PHP 8.2+** (bundled with Laragon; XAMPP users check version).

Nothing needed for Phase 1 beyond Node — just `npm install` then `npm start` after Claude adds the code.
