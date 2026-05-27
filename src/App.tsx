import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Topbar from "./components/Topbar";
import { lazy } from "react";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(()=> import("./pages/Dashboard"));
const EmployeeForm = lazy(()=> import("./pages/EmployeeOnBoardingParent"));
const EmployeeAttendance = lazy(()=> import("./pages/EmployeeAttendance"));


/**
 * 🔐 Auth check (replace with real logic)
 */
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // or cookie / context
};

/**
 * 🔐 Protected Route Wrapper
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function Layout() {

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      {/* {isLoading ? (
        <div className="w-64 flex items-center justify-center bg-gray-900 text-white">
          Loading menu...
        </div>
      ) : isError ? (
        <div className="w-64 flex items-center justify-center bg-gray-900 text-red-400">
          Failed to load menu
        </div>
      ) : (
        <Sidebar menu={menu ?? []} />
      )} */}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <div className="flex-1 p-2 bg-gray-50 overflow-y-auto overflow-x-hidden min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/recruitment" element={<EmployeeForm/>}/>
            <Route path="/attendance" element={<EmployeeAttendance/>} />
            <Route path="/currency" element={<Page title="Currency" />} />
            <Route path="/branch" element={<Page title="Branch" />} />
            <Route path="/journal" element={<Page title="Journal Entry" />} />
            <Route path="/reports" element={<Page title="Reports" />} />
            <Route path="/voucher" element={<Page title="Voucher" />} />
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
  return (<>
   <Toaster position="top-right" />
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* 🔐 Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}