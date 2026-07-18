// Mock API layer. Every function returns a Promise so components can `await`
// exactly as they will against the real Laravel backend. In-memory only —
// data resets on page refresh. Replaced by real endpoints in Phase 4+.

import { MOCK_WORKERS, MOCK_REVIEWS } from "./mockData";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Simple in-memory "database" seeded from mock data.
let users = [
  {
    id: 1,
    full_name: "Demo Customer",
    email: "customer@fixkar.test",
    password: "password",
    role: "customer",
    city: "Karachi",
    phone: "03001234567",
    photo_path: null,
  },
  {
    id: 2,
    full_name: "Imran Ali",
    email: "worker@fixkar.test",
    password: "password",
    role: "worker",
    city: "Karachi",
    phone: "03007654321",
    photo_path: null,
  },
];
let nextUserId = 3;
let bookings = [];
let nextBookingId = 1;

const publicUser = (u) => {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
};

const fakeToken = (u) => `mock-token-${u.id}`;

// Builds a fake Axios-style error (Error instance + .response) so callers
// can use the same catch-block shape they'll use against the real backend.
const apiError = (status, message) => {
  const err = new Error(message || `Request failed with status ${status}`);
  err.response = { status, data: message ? { message } : undefined };
  return err;
};

export const mockApi = {
  // ---- Auth ----
  async register({ full_name, email, password }) {
    await delay();
    if (users.some((u) => u.email === email)) {
      throw apiError(422, "Email already registered.");
    }
    const user = {
      id: nextUserId++,
      full_name,
      email,
      password,
      role: null, // chosen at role-selection
      city: null,
      phone: null,
      photo_path: null,
    };
    users.push(user);
    return { token: fakeToken(user), user: publicUser(user) };
  },

  async login({ email, password }) {
    await delay();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw apiError(401, "Invalid credentials.");
    }
    return { token: fakeToken(user), user: publicUser(user) };
  },

  async me(token) {
    await delay(150);
    const id = Number(String(token).replace("mock-token-", ""));
    const user = users.find((u) => u.id === id);
    if (!user) throw apiError(401);
    return publicUser(user);
  },

  async selectRole(token, role) {
    await delay();
    const id = Number(String(token).replace("mock-token-", ""));
    const user = users.find((u) => u.id === id);
    if (!user) throw apiError(401);
    user.role = role;
    return publicUser(user);
  },

  async logout() {
    await delay(100);
    return { ok: true };
  },

  // ---- Workers (public) ----
  async getWorkers({ category, city, search } = {}) {
    await delay();
    let list = [...MOCK_WORKERS];
    if (category) list = list.filter((w) => w.category === category);
    if (city) list = list.filter((w) => w.city === city);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.full_name.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          (w.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async getWorker(id) {
    await delay();
    const worker = MOCK_WORKERS.find((w) => w.id === Number(id));
    if (!worker) throw apiError(404);
    return worker;
  },

  async getWorkerReviews(id) {
    await delay();
    return MOCK_REVIEWS.filter((r) => r.worker_id === Number(id));
  },

  // ---- Bookings (used from Phase 5; stubbed here) ----
  async createBooking(token, payload) {
    await delay();
    const booking = { id: nextBookingId++, status: "pending", ...payload };
    bookings.push(booking);
    return booking;
  },

  async getBookings() {
    await delay();
    return bookings;
  },
};
