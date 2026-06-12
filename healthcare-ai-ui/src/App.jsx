import { useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

import LandingPage from "./pages/LandingPage";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import ActiveCases from "./pages/ActiveCases";
import PendingReports from "./pages/PendingReports";
import AIRecommendations from "./pages/AIRecommendations";
import PatientHistory from "./pages/PatientHistory";
import TimelinePage from "./pages/TimelinePage";
import DailyStats from "./pages/DailyStats";
import Performance from "./pages/Performance";
import ExportData from "./pages/ExportData";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/SettingsPage";
import Help from "./pages/Help";
import DecisionPanel from "./pages/DecisionPanel";
import Emergency from "./pages/Emergency";
import AmbulanceTracking from "./pages/AmbulanceTracking";
import Support from "./pages/Support";
import About from "./pages/About";
import EditProfile from "./pages/EditProfile";

import RoleSelection from "./pages/RoleSelection";
import DoctorLogin from "./pages/DoctorLogin";
import PatientLogin from "./pages/PatientLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import PatientDashboard from "./pages/PatientDashboard";
import UploadReport from "./pages/UploadReport";
import AIReportAnalysis from "./pages/AIReportAnalysis";
import PatientNotifications from "./pages/PatientNotifications";
import PatientProfilePage from "./pages/PatientProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import PatientLayout from "./pages/PatientLayout";
import PatientSettings from "./pages/PatientSettings";
import SignIn from "./pages/SignIn";
import DoctorSignIn from "./pages/DoctorSignIn";
import PatientSignIn from "./pages/PatientSignIn";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/signin" element={<SignIn />} />

        <Route path="/doctor-signin" element={<DoctorSignIn />} />

        <Route path="/patient-signin" element={<PatientSignIn />} />

        <Route path="/role" element={<RoleSelection />} />

        <Route path="/doctor-login" element={<DoctorLogin />} />

        <Route path="/patient-login" element={<PatientLogin />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* PATIENT ROUTES */}

        

        <Route
  path="/patient"
  element={
    <ProtectedRoute allowedRole="patient">
      <PatientLayout />
    </ProtectedRoute>
  }
>
  <Route
    path="dashboard"
    element={<PatientDashboard />}
  />

  <Route
    path="upload-report"
    element={<UploadReport />}
  />

  <Route
    path="ai-analysis"
    element={<AIReportAnalysis />}
  />

  <Route
    path="notifications"
    element={<PatientNotifications />}
  />

  <Route
    path="profile"
    element={<PatientProfilePage />}
  />

  <Route
  path="settings"
  element={<PatientSettings />}
/>
</Route>



        {/* DOCTOR ROUTES */}

        <Route
          path="/*"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DashboardShell />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed((current) => !current)
        }
      />

      <div
        className="flex-1 p-8 xl:p-10 transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? "5rem" : "18rem",
        }}
      >
        <Topbar
          onMenuClick={() =>
            setSidebarCollapsed((current) => !current)
          }
        />

        <Routes>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/patients" element={<Patients />} />

          <Route
            path="/patients/:id"
            element={<PatientProfile />}
          />

          <Route path="/alerts" element={<Alerts />} />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/active-cases"
            element={<ActiveCases />}
          />

          <Route
            path="/pending-reports"
            element={<PendingReports />}
          />

          <Route
            path="/ai-recommendations"
            element={<AIRecommendations />}
          />

          <Route
            path="/patient-history"
            element={<PatientHistory />}
          />

          <Route
            path="/timeline"
            element={<TimelinePage />}
          />

          <Route
            path="/daily-stats"
            element={<DailyStats />}
          />

          <Route
            path="/performance"
            element={<Performance />}
          />

          <Route
            path="/export-data"
            element={<ExportData />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/decision-panel"
            element={<DecisionPanel />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />

          <Route
            path="/help"
            element={<Help />}
          />

          <Route
            path="/reports/:id"
            element={<Reports />}
          />

          <Route
            path="/emergency"
            element={<Emergency />}
          />

          <Route
            path="/ambulance-tracking"
            element={<AmbulanceTracking />}
          />

          <Route
            path="/support"
            element={<Support />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/edit-profile"
            element={<EditProfile />}
          />

          <Route
            path="*"
            element={
              <div className="rounded-[32px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Navigation
                </p>

                <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                  Page not found
                </h1>

                <p className="mt-3 text-sm text-slate-600">
                  The requested page could not be located.
                </p>
              </div>
            }
          />

        </Routes>
      </div>

      <Link
        to="/ai-recommendations"
        className="fixed bottom-8 right-8 z-50 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-110"
      >
        AI Assistant
      </Link>

    </div>
  );
}
