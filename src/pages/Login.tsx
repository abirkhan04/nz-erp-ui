import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Shield,
} from "lucide-react";
import logo from "../assets/logo.png";


import { useState } from "react";
import { usePost } from "../hooks/usePost";
import { API_ROUTES } from "../api/routes";

import {
  Users,
  CalendarDays,
  Search,
  Plane,
  BarChart3,
  ShieldCheck,
  Leaf,
  FileText,
} from "lucide-react";

const modules = [
  {
    title: "HR & PAYROLL",
    icon: Users,
    border: "border-cyan-400",
    iconColor: "text-cyan-300",
  },
  {
    title: "ATTENDANCE",
    icon: CalendarDays,
    border: "border-sky-400",
    iconColor: "text-sky-300",
  },
  {
    title: "RECRUITMENT",
    icon: Search,
    border: "border-lime-400",
    iconColor: "text-lime-300",
  },
  {
    title: "LEAVE",
    icon: Plane,
    border: "border-blue-500",
    iconColor: "text-blue-300",
  },
  {
    title: "PERFORMANCE",
    icon: BarChart3,
    border: "border-blue-400",
    iconColor: "text-blue-300",
  },
  {
    title: "COMPLIANCE",
    icon: ShieldCheck,
    border: "border-cyan-400",
    iconColor: "text-cyan-300",
  },
  {
    title: "SUSTAINABILITY",
    icon: Leaf,
    border: "border-green-400",
    iconColor: "text-green-300",
  },
  {
    title: "REPORTS",
    icon: FileText,
    border: "border-blue-500",
    iconColor: "text-blue-300",
  },
];

type FormData = {
  username: string;
  password: string;
  companyId: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: login, isPending } = usePost(API_ROUTES.LOGIN);

  const onSubmit = async (data: FormData) => {
    try {
      const res: any = await login({
        username: data.username,
        password: data.password,
      });

      const token = res?.id;

      if (token) {
        localStorage.setItem("token", token);
      }

      navigate("/");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-b from-[#051B4D] via-[#072A72] to-[#04153D] text-white">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952')",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-4">
              <div className="h-[150px] w-[150px] flex items-center justify-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 550,
                    letterSpacing: "1px",
                    transform: "scaleX(1.08)",
                    transformOrigin: "left center",
                  }}
                  className="text-[56px] text-white leading-none"
                >
                  SYNEXIS
                </h1>
                <p
                  style={{
                    fontWeight: 600,
                    letterSpacing: "0.2px",
                  }}
                  className="text-[#25C7F6] text-[21px]"
                >
                  Creating Enterprise Synergy
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-white/20 pt-6">
              <p className="text-xl text-gray-200">
                Integrated ERP for People, Process and Performance
              </p>
            </div>

            {/* Modules */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-10 mt-4">
              {modules.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`
            w-14 h-14
            rounded-full
            border
            ${item.border}
            flex items-center justify-center
          `}
                    >
                      <Icon
                        size={24}
                        className={item.iconColor}
                      />
                    </div>

                    <span className="mt-3 text-[11px] text-center text-white">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-300">
            <h3 className="font-semibold text-xl">
              NZ TEX GROUP
            </h3>

            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              <span>NZ Textile</span>
              <span>NZ Fabrics</span>
              <span>NZ Denim</span>
              <span>NZ Spinning</span>
              <span>Dy Flax</span>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              © 2026 NZ Tex Group. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 bg-[#F6F8FC] flex items-center justify-center p-8">

        <div className="w-full max-w-md bg-white rounded-[30px] shadow-2xl p-10">

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-[#0F172A]">
              Welcome to
              <span className="text-[#2563EB] ml-2">
                SYNEXIS
              </span>
            </h2>

            <p className="text-gray-500 mt-2">
              Please sign in to continue
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Company */}

            {/* User */}
            <div>
              <label className="text-sm font-medium">
                User ID
              </label>

              <div className="relative mt-2">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  {...register("username")}
                  placeholder="Enter User ID"
                  className="w-full h-12 border rounded-lg pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">
                Password
              </label>

              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  {...register("password")}
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter Password"
                  className="w-full h-12 border rounded-lg pl-10 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-blue-600"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-[#0D4CD3] hover:bg-[#0B42B5] text-white rounded-lg font-semibold transition"
            >
              {isPending
                ? "Signing In..."
                : "Sign In"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex justify-center gap-6 text-sm text-gray-500 pt-4">
              <span>🔒 Secure</span>
              <span>• Reliable</span>
              <span>• Integrated</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}