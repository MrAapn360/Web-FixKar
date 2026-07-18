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
import Placeholder from "./pages/Placeholder";

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
                <Placeholder title="Notifications" phase="Phase 9" />
              </ProtectedRoute>
            }
          />

          {/* ---- Customer ---- */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute role="customer">
                <Placeholder title="Customer Dashboard" phase="Phase 5" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/book/:workerId"
            element={
              <ProtectedRoute role="customer">
                <Placeholder title="Book a Service" phase="Phase 5" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/bookings/:id"
            element={
              <ProtectedRoute role="customer">
                <Placeholder title="Booking Detail" phase="Phase 5" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute role="customer">
                <Placeholder title="My Profile" phase="Phase 8" />
              </ProtectedRoute>
            }
          />

          {/* ---- Worker ---- */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute role="worker">
                <Placeholder title="Worker Dashboard" phase="Phase 5" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/bookings/:id"
            element={
              <ProtectedRoute role="worker">
                <Placeholder title="Booking Detail" phase="Phase 5" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/profile-setup"
            element={
              <ProtectedRoute role="worker">
                <Placeholder title="Set Up Your Worker Profile" phase="Phase 5" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/profile"
            element={
              <ProtectedRoute role="worker">
                <Placeholder title="My Worker Profile" phase="Phase 8" />
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
