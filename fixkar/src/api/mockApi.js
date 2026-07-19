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
let paymentMethods = {}; // user_id -> { easypaisa_number, account_title }
let workerProfiles = {}; // user_id -> worker profile fields
let notifications = []; // { id, user_id, type, related_id, title, body, is_read, created_at }
let nextNotificationId = 1;

const pushNotification = (userId, type, relatedId, title, body) => {
  if (!userId) return;
  notifications.push({
    id: nextNotificationId++,
    user_id: userId,
    type,
    related_id: relatedId,
    title,
    body,
    is_read: false,
    created_at: new Date().toISOString(),
  });
};

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
  async register({ full_name, email, password, role, worker_profile }) {
    await delay();
    if (users.some((u) => u.email === email)) {
      throw apiError(422, "Email already registered.");
    }
    const user = {
      id: nextUserId++,
      full_name,
      email,
      password,
      role: role || null, // null -> falls back to /role-selection
      city: worker_profile?.city || null,
      phone: null,
      photo_path: null,
    };
    users.push(user);

    if (role === "worker" && worker_profile) {
      workerProfiles[user.id] = {
        user_id: user.id,
        category: worker_profile.category,
        bio: worker_profile.bio || null,
        skills: worker_profile.skills || [],
        experience_years: worker_profile.experience_years ?? null,
        hourly_rate: worker_profile.hourly_rate ?? null,
        service_area: worker_profile.service_area || null,
        is_available: true,
      };
    }

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
  // Merges the static demo roster with real accounts that signed up as
  // workers, so newly registered workers actually show up to customers
  // instead of only existing in the seed data.
  _allWorkers() {
    const registered = users
      .filter((u) => u.role === "worker" && workerProfiles[u.id])
      .map((u) => {
        const p = workerProfiles[u.id];
        return {
          id: u.id,
          full_name: u.full_name,
          city: u.city || p.city || null,
          photo_path: u.photo_path || null,
          category: p.category,
          bio: p.bio || "",
          skills: p.skills || [],
          experience_years: p.experience_years ?? 0,
          hourly_rate: p.hourly_rate ?? 0,
          service_area: p.service_area || "",
          is_available: p.is_available ?? true,
          is_verified: false,
          average_rating: 0,
          total_reviews: 0,
          total_jobs_done: 0,
        };
      });
    return [...MOCK_WORKERS, ...registered];
  },

  async getWorkers({ category, city, search } = {}) {
    await delay();
    let list = this._allWorkers();
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
    const worker = this._allWorkers().find((w) => w.id === Number(id));
    if (!worker) throw apiError(404);
    return worker;
  },

  async getWorkerReviews(id) {
    await delay();
    return MOCK_REVIEWS.filter((r) => r.worker_id === Number(id));
  },

  // ---- Bookings ----
  async createBooking(token, payload) {
    await delay();
    const id = Number(String(token).replace("mock-token-", ""));
    const customer = users.find((u) => u.id === id);
    const worker = this._allWorkers().find((w) => w.id === Number(payload.worker_id));
    if (!worker) throw apiError(404, "This worker no longer exists.");
    const booking = {
      id: nextBookingId++,
      status: "pending",
      customer_id: id,
      worker_id: Number(payload.worker_id),
      worker_name: worker?.full_name,
      created_at: new Date().toISOString(),
      ...payload,
    };
    bookings.push(booking);

    pushNotification(
      booking.worker_id,
      "booking",
      booking.id,
      "New booking request",
      `${customer?.full_name || "A customer"} requested a ${booking.category} job.`
    );

    return booking;
  },

  async getBookings(token) {
    await delay();
    const id = Number(String(token).replace("mock-token-", ""));
    return bookings.filter((b) => b.customer_id === id || b.worker_id === id);
  },

  async getBooking(token, id) {
    await delay();
    const booking = bookings.find((b) => b.id === Number(id));
    if (!booking) throw apiError(404);
    return booking;
  },

  async updateBookingStatus(token, id, status) {
    await delay();
    const booking = bookings.find((b) => b.id === Number(id));
    if (!booking) throw apiError(404);
    booking.status = status;

    const customer = users.find((u) => u.id === booking.customer_id);
    const worker = users.find((u) => u.id === booking.worker_id);
    const workerName = worker?.full_name || booking.worker_name || "The worker";
    const customerName = customer?.full_name || "The customer";

    const messages = {
      accepted: [booking.customer_id, "Booking accepted", `${workerName} accepted your ${booking.category} request.`],
      rejected: [booking.customer_id, "Booking declined", `${workerName} declined your ${booking.category} request.`],
      started: [booking.customer_id, "Work started", `${workerName} started your ${booking.category} job.`],
      completed: [booking.customer_id, "Job completed", `${workerName} marked your ${booking.category} job as complete.`],
      cancelled: [booking.worker_id, "Booking cancelled", `${customerName} cancelled the ${booking.category} request.`],
    };
    const entry = messages[status];
    if (entry) {
      pushNotification(entry[0], "booking", booking.id, entry[1], entry[2]);
    }

    return booking;
  },

  // ---- Reviews ----
  async reviewBooking(token, id, { rating, comment, tags }) {
    await delay();
    const booking = bookings.find((b) => b.id === Number(id));
    if (!booking) throw apiError(404);
    if (booking.status !== "completed") {
      throw apiError(422, "You can only review a completed booking.");
    }
    if (booking.is_reviewed) {
      throw apiError(422, "You already reviewed this booking.");
    }
    booking.is_reviewed = true;

    const worker = MOCK_WORKERS.find((w) => w.id === Number(booking.worker_id));
    if (worker) {
      const newTotal = worker.total_reviews + 1;
      worker.average_rating =
        Math.round(
          (((worker.average_rating * worker.total_reviews) + rating) / newTotal) * 100
        ) / 100;
      worker.total_reviews = newTotal;
    }

    const review = {
      id: MOCK_REVIEWS.length + 1,
      worker_id: booking.worker_id,
      customer_name: "You",
      rating,
      comment: comment || "",
      tags: tags || [],
      created_at: new Date().toISOString().slice(0, 10),
    };
    MOCK_REVIEWS.push(review);
    return review;
  },

  // ---- Payments ----
  async payBooking(token, id, { method, amount }) {
    await delay();
    const booking = bookings.find((b) => b.id === Number(id));
    if (!booking) throw apiError(404);
    if (booking.status !== "completed") {
      throw apiError(422, "You can only pay for a completed booking.");
    }
    if (booking.is_paid) {
      throw apiError(422, "This booking has already been paid.");
    }

    const finalAmount = amount || booking.final_cost || booking.estimated_cost || 0;
    const commissionRate = 5;
    const commissionAmount = Math.round(finalAmount * (commissionRate / 100));
    const workerPayout = finalAmount - commissionAmount;

    booking.is_paid = true;
    booking.final_cost = booking.final_cost || finalAmount;

    pushNotification(
      booking.worker_id,
      "payment",
      booking.id,
      "Payment received",
      `You were paid Rs ${workerPayout} for the ${booking.category} job.`
    );

    return {
      id: Date.now(),
      booking_id: booking.id,
      method,
      amount: finalAmount,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      worker_payout: workerPayout,
      status: "paid",
      paid_at: new Date().toISOString(),
    };
  },

  // ---- Payment method ----
  async getPaymentMethod(token) {
    await delay(150);
    const id = Number(String(token).replace("mock-token-", ""));
    return paymentMethods[id] || { easypaisa_number: null, account_title: null };
  },

  async updatePaymentMethod(token, data) {
    await delay();
    const id = Number(String(token).replace("mock-token-", ""));
    paymentMethods[id] = { ...paymentMethods[id], ...data };
    return paymentMethods[id];
  },

  // ---- Profile ----
  async updateProfile(token, data) {
    await delay();
    const id = Number(String(token).replace("mock-token-", ""));
    const user = users.find((u) => u.id === id);
    if (!user) throw apiError(401);
    Object.assign(user, data);
    return publicUser(user);
  },

  async uploadPhoto(token, file) {
    await delay(600);
    const id = Number(String(token).replace("mock-token-", ""));
    const user = users.find((u) => u.id === id);
    if (!user) throw apiError(401);
    // No real upload in mock mode — use a local object URL so the UI can preview it.
    const url = URL.createObjectURL(file);
    user.photo_path = url;
    return { photo_path: url, photo_url: url };
  },

  async updateWorkerProfile(token, data) {
    await delay();
    const id = Number(String(token).replace("mock-token-", ""));
    const user = users.find((u) => u.id === id);
    if (!user) throw apiError(401);
    if (user.role !== "worker") {
      throw apiError(403, "Only workers have a worker profile.");
    }
    workerProfiles[id] = { ...workerProfiles[id], ...data, user_id: id };
    return workerProfiles[id];
  },

  async deleteAccount(token) {
    await delay();
    const id = Number(String(token).replace("mock-token-", ""));
    users = users.filter((u) => u.id !== id);
    delete workerProfiles[id];
    delete paymentMethods[id];
    notifications = notifications.filter((n) => n.user_id !== id);
    // Bookings/reviews/payments stay, matching the real backend's behavior.
    return { ok: true };
  },

  // ---- Notifications ----
  async getNotifications(token) {
    await delay(200);
    const id = Number(String(token).replace("mock-token-", ""));
    return notifications
      .filter((n) => n.user_id === id)
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getUnreadCount(token) {
    await delay(100);
    const id = Number(String(token).replace("mock-token-", ""));
    const count = notifications.filter((n) => n.user_id === id && !n.is_read).length;
    return { count };
  },

  async markNotificationRead(token, id) {
    await delay(100);
    const notification = notifications.find((n) => n.id === Number(id));
    if (!notification) throw apiError(404);
    notification.is_read = true;
    return notification;
  },

  async markAllNotificationsRead(token) {
    await delay(150);
    const id = Number(String(token).replace("mock-token-", ""));
    notifications.forEach((n) => {
      if (n.user_id === id) n.is_read = true;
    });
    return { ok: true };
  },
};
