import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import Topbar from "./components/Topbar";
import OTForwardingPage from "./pages/Attendance/OTForwarding";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EmployeeForm = lazy(() => import("./pages/RecruitmentDashboard"));
const EmployeeAttendance = lazy(() => import("./pages/EmployeeAttendance"));
const GateRegistration = lazy(() => import("./pages/Recruitment/GateRegistration"));
const MedicalExamination = lazy(() => import("./pages/Recruitment/MedicalExamination"));
const HRExecutiveEntry = lazy(() => import("./pages/Recruitment/HRExecutiveEntry"));
const HRExecutiveEntryDetails = lazy(() => import("./pages/Recruitment/HRExecutiveEntryDetail"));
const BiometricCapture = lazy(() => import("./pages/Recruitment/BiometricAndPicture"));
const DirectorsReview = lazy(() => import("./pages/Recruitment/DirectorsReview"));
const ITActivation = lazy(() => import("./pages/Recruitment/ITActivation"));
const RecruitmentReports = lazy(() => import("./pages/Recruitment/RecruitmentReport"));
const EmployeeMasterList = lazy(() => import("./pages/Recruitment/recruitment-reports/EmployeeMasterList"));
const EmployeeDetailProfile = lazy(() => import("./pages/Recruitment/recruitment-reports/EmployeeDetailProfile/EmployeeDetailProfile"));


/*
    Attendance related tasks
*/
const AttendanceSummary = lazy(() => import("./pages/Attendance/AttendanceSummary"));
const ProductionFloorPortal = lazy(() => import("./pages/Attendance/ProductionFloorPortal"));
const LeavePortal = lazy(() => import("./pages/Attendance/leave-portal"));
const ForwardLeaveRequest = lazy(() => import("./pages/Attendance/ForwardLeaveRequest"));
const LeaveEncashment = lazy(() => import("./pages/Attendance/LeaveEncashment"));
const EarnedLeaveEncashment = lazy(() => import("./pages/Attendance/EarnedLeaveEncashment"));
const MaternityLeaveEncashment = lazy(() => import("./pages/Attendance/MaternityLeaveEncashment"));
const EmployeeIncrementAndPromotion = lazy(() => import("./pages/Attendance/EmployeeIncrementAndPromotion"));
const PerformanceIncrementRequest = lazy(() => import("./pages/Attendance/PerformanceIncrementRequest"));
const PromotionAndIncrementRequest = lazy(() => import("./pages/Attendance/PromotionAndIncrement"));

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
              path="/recruitment/hr-executive-entry"
              element={<HRExecutiveEntry />}
            />

            <Route
              path="/recruitment/hr-executive-entry/:candidateId/:enrollmentId"
              element={<HRExecutiveEntryDetails />}
            />

            <Route
              path="/recruitment/hr-executive-entry/staff-management"
              element={<HRExecutiveEntryDetails />}
            />

            <Route
              path="/recruitment/biometric-picture-capture"
              element={<BiometricCapture />}
            />

            <Route
              path="/recruitment/director-review"
              element={<DirectorsReview />}
            />

            <Route
              path="/recruitment/it-activation"
              element={<ITActivation />}
            />

            <Route
              path="/recruitment/recruitment-reports"
              element={<RecruitmentReports />}
            />

            <Route
              path="/recruitment/recruitment-reports/employee-master-list"
              element={<EmployeeMasterList />}
            />

            <Route
              path="/recruitment/recruitment-reports/employee-detail-profile"
              element={<EmployeeDetailProfile />}
            />

            <Route
              path="/recruitment/recruitment-reports/employee-detail-profile/:employeeCode?"
              element={<EmployeeDetailProfile />}
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

          <Route
            path="/attendance-summary"
            element={<ProtectedRoute>
              <AttendanceSummary />
            </ProtectedRoute>} />

          <Route
            path="/production-floor-portal"
            element={<ProtectedRoute>
              <ProductionFloorPortal />
            </ProtectedRoute>}
          />

          <Route
            path="/ot-forwarding"
            element={<ProtectedRoute>
              <OTForwardingPage />
            </ProtectedRoute>}
          />

          <Route
            path="/leave-portal"
            element={<ProtectedRoute>
              <LeavePortal />
            </ProtectedRoute>}
          />

          <Route
            path="/forward-leave-request"
            element={<ProtectedRoute>
              <ForwardLeaveRequest />
            </ProtectedRoute>}
          />

          <Route
            path="/leave-encashment"
            element={<ProtectedRoute>
              <LeaveEncashment />
            </ProtectedRoute>}
          />


          <Route
            path="/earned-leave-encashment"
            element={<ProtectedRoute>
              <EarnedLeaveEncashment />
            </ProtectedRoute>}
          />

          <Route
            path="/maternity-leave-encashment"
            element={<ProtectedRoute>
              <MaternityLeaveEncashment />
            </ProtectedRoute>}
          />


          <Route
            path="/employee-increment"
            element={<ProtectedRoute>
              <EmployeeIncrementAndPromotion />
            </ProtectedRoute>}
          />

          <Route
            path="/employee-increment/performance"
            element={<ProtectedRoute>
              <PerformanceIncrementRequest />
            </ProtectedRoute>}
          />

          <Route
            path="/employee-increment/promotion"
            element={<ProtectedRoute>
              <PromotionAndIncrementRequest />
            </ProtectedRoute>}
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