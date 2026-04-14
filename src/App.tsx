import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useGet } from "./hooks/useGet";
import { fetchMenu } from "./mock/Api";
import type { MenuItemType } from "./types/interfaces";
import Topbar from "./components/Topbar";
import { lazy } from "react";

const Login = lazy(() => import("./pages/Login"));

/**
 * 🔐 Auth check (replace with real logic)
 */
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // or cookie / context
};

/**
 * 🔐 Protected Route Wrapper
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function Layout() {
  const {
    data: menu,
    isLoading,
    isError,
  } = useGet<MenuItemType[]>({
    key: ["menu"],
    queryFn: fetchMenu,
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isLoading ? (
        <div className="w-64 flex items-center justify-center bg-gray-900 text-white">
          Loading menu...
        </div>
      ) : isError ? (
        <div className="w-64 flex items-center justify-center bg-gray-900 text-red-400">
          Failed to load menu
        </div>
      ) : (
        <Sidebar menu={menu ?? []} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Routes>
            <Route path="/" element={<Page title="Dashboard" />} />
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
  return (
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
  );
}