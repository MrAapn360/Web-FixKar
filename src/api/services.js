// Unified service layer the UI calls. Internally routes to the mock API
// (Phase 1) or the real Laravel backend (Phase 4+) based on USE_MOCK.
// Components import from here and never care which backend is live.

import api, { USE_MOCK, getToken } from "./client";
import { mockApi } from "./mockApi";

export const authService = {
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
};
