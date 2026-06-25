import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import Topbar from "./components/Topbar";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EmployeeForm = lazy(() => import("./pages/RecruitmentDashboard"));
const EmployeeAttendance = lazy(() => import("./pages/EmployeeAttendance"));
const GateRegistration = lazy(() => import("./pages/Recruitment/GateRegistration"));
const MedicalExamination = lazy(() => import("./pages/Recruitment/MedicalExamination"));

/**
 * 🔐 Auth Check
 */
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * 🔐 Protected Route
 */
const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Main Layout (with Topbar)
 */
function Layout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <div className="flex-1 p-2 bg-gray-50 overflow-y-auto overflow-x-hidden min-w-0">
          <Routes>
            <Route
              path="/recruitment"
              element={<EmployeeForm />}
            />

            <Route
              path="/recruitment/gate-registration"
              element={<GateRegistration />}
            />

            <Route
              path="/recruitment/medical-examination"
              element={<MedicalExamination />}
            />

            <Route
              path="/attendance"
              element={<EmployeeAttendance />}
            />

            <Route
              path="/currency"
              element={<Page title="Currency" />}
            />

            <Route
              path="/branch"
              element={<Page title="Branch" />}
            />

            <Route
              path="/journal"
              element={<Page title="Journal Entry" />}
            />

            <Route
              path="/reports"
              element={<Page title="Reports" />}
            />

            <Route
              path="/voucher"
              element={<Page title="Voucher" />}
            />

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

const Page = ({ title }: { title: string }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <h1 className="text-xl font-semibold">{title}</h1>
  </div>
);

export default function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard (No Topbar) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Application Routes (With Topbar) */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}