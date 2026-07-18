import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import Workers from "./pages/Workers";
import WorkerProfile from "./pages/WorkerProfile";
import BookService from "./pages/BookService";
import BookingDetail from "./pages/BookingDetail";
import CustomerDashboard from "./pages/CustomerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import PaymentMethodSettings from "./pages/PaymentMethodSettings";
import CustomerProfile from "./pages/CustomerProfile";
import WorkerProfileSettings from "./pages/WorkerProfileSettings";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* ---- Public ---- */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/workers/:id" element={<WorkerProfile />} />

          {/* ---- Shared (auth) ---- */}
          <Route
            path="/role-selection"
            element={
              <ProtectedRoute>
                <RoleSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* ---- Customer ---- */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/book/:workerId"
            element={
              <ProtectedRoute role="customer">
                <BookService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/bookings/:id"
            element={
              <ProtectedRoute role="customer">
                <BookingDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute role="customer">
                <CustomerProfile />
              </ProtectedRoute>
            }
          />

          {/* ---- Worker ---- */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute role="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/bookings/:id"
            element={
              <ProtectedRoute role="worker">
                <BookingDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/payment-method"
            element={
              <ProtectedRoute role="worker">
                <PaymentMethodSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/profile-setup"
            element={
              <ProtectedRoute role="worker">
                <WorkerProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/profile"
            element={
              <ProtectedRoute role="worker">
                <WorkerProfileSettings />
              </ProtectedRoute>
            }
          />

          {/* ---- Fallback ---- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
