// Unified service layer the UI calls. Internally routes to the mock API
// (Phase 1) or the real Laravel backend (Phase 4+) based on USE_MOCK.
// Components import from here and never care which backend is live.

import api, { USE_MOCK, getToken } from "./client";
import { mockApi } from "./mockApi";

export const authService = {
  // data: { full_name, email, password, role?, worker_profile? }
  // Passing role (+ worker_profile for workers) sets everything up in one
  // request, so new signups land straight in their dashboard — no separate
  // /role-selection detour.
  register: (data) =>
    USE_MOCK ? mockApi.register(data) : api.post("/register", data).then((r) => r.data),
  login: (data) =>
    USE_MOCK ? mockApi.login(data) : api.post("/login", data).then((r) => r.data),
  me: () =>
    USE_MOCK ? mockApi.me(getToken()) : api.get("/me").then((r) => r.data),
  selectRole: (role) =>
    USE_MOCK
      ? mockApi.selectRole(getToken(), role)
      : api.post("/select-role", { role }).then((r) => r.data),
  logout: () =>
    USE_MOCK ? mockApi.logout() : api.post("/logout").then((r) => r.data),
};

export const workerService = {
  list: (params) =>
    USE_MOCK ? mockApi.getWorkers(params) : api.get("/workers", { params }).then((r) => r.data),
  get: (id) =>
    USE_MOCK ? mockApi.getWorker(id) : api.get(`/workers/${id}`).then((r) => r.data),
  reviews: (id) =>
    USE_MOCK
      ? mockApi.getWorkerReviews(id)
      : api.get(`/workers/${id}/reviews`).then((r) => r.data),
};

export const bookingService = {
  create: (data) =>
    USE_MOCK
      ? mockApi.createBooking(getToken(), data)
      : api.post("/bookings", data).then((r) => r.data),
  list: () =>
    USE_MOCK ? mockApi.getBookings(getToken()) : api.get("/bookings").then((r) => r.data),
  get: (id) =>
    USE_MOCK
      ? mockApi.getBooking(getToken(), id)
      : api.get(`/bookings/${id}`).then((r) => r.data),
  accept: (id) =>
    USE_MOCK
      ? mockApi.updateBookingStatus(getToken(), id, "accepted")
      : api.post(`/bookings/${id}/accept`).then((r) => r.data),
  reject: (id) =>
    USE_MOCK
      ? mockApi.updateBookingStatus(getToken(), id, "rejected")
      : api.post(`/bookings/${id}/reject`).then((r) => r.data),
  start: (id) =>
    USE_MOCK
      ? mockApi.updateBookingStatus(getToken(), id, "started")
      : api.post(`/bookings/${id}/start`).then((r) => r.data),
  complete: (id, data) =>
    USE_MOCK
      ? mockApi.updateBookingStatus(getToken(), id, "completed")
      : api.post(`/bookings/${id}/complete`, data).then((r) => r.data),
  cancel: (id) =>
    USE_MOCK
      ? mockApi.updateBookingStatus(getToken(), id, "cancelled")
      : api.post(`/bookings/${id}/cancel`).then((r) => r.data),
  review: (id, data) =>
    USE_MOCK
      ? mockApi.reviewBooking(getToken(), id, data)
      : api.post(`/bookings/${id}/review`, data).then((r) => r.data),
  pay: (id, data) =>
    USE_MOCK
      ? mockApi.payBooking(getToken(), id, data)
      : api.post(`/bookings/${id}/payment`, data).then((r) => r.data),
};

export const paymentMethodService = {
  get: () =>
    USE_MOCK
      ? mockApi.getPaymentMethod(getToken())
      : api.get("/payment-method").then((r) => r.data),
  update: (data) =>
    USE_MOCK
      ? mockApi.updatePaymentMethod(getToken(), data)
      : api.put("/payment-method", data).then((r) => r.data),
};

export const notificationService = {
  list: () =>
    USE_MOCK ? mockApi.getNotifications(getToken()) : api.get("/notifications").then((r) => r.data),
  unreadCount: () =>
    USE_MOCK
      ? mockApi.getUnreadCount(getToken())
      : api.get("/notifications/unread-count").then((r) => r.data),
  markRead: (id) =>
    USE_MOCK
      ? mockApi.markNotificationRead(getToken(), id)
      : api.post(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () =>
    USE_MOCK
      ? mockApi.markAllNotificationsRead(getToken())
      : api.post("/notifications/read-all").then((r) => r.data),
};

export const profileService = {
  update: (data) =>
    USE_MOCK
      ? mockApi.updateProfile(getToken(), data)
      : api.put("/profile", data).then((r) => r.data),
  uploadPhoto: (file) => {
    if (USE_MOCK) return mockApi.uploadPhoto(getToken(), file);
    const form = new FormData();
    form.append("photo", file);
    return api
      .post("/profile/photo", form, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
  updateWorkerProfile: (data) =>
    USE_MOCK
      ? mockApi.updateWorkerProfile(getToken(), data)
      : api.put("/profile/worker", data).then((r) => r.data),
  deleteAccount: () =>
    USE_MOCK ? mockApi.deleteAccount(getToken()) : api.delete("/profile").then((r) => r.data),
};
