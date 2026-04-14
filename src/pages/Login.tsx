import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { usePost } from "../hooks/usePost";
import { API_ROUTES } from "../api/routes";

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

      console.log("Login Success:", res);

      // Axios হলে res.data, fetch হলে res directly
      const token = res?.data?.id || res?.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      navigate("/");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      // alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">

      <div className="flex flex-col items-center">

        {/* Logo + Title */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-[#2F80ED]">SYNEXIS</h1>
          <p className="text-sm text-[#333333]/70">HRM ERP SYSTEM</p>
        </div>

        {/* Card */}
        <div className="w-[400px] h-[80vh] bg-white rounded-2xl shadow-lg border border-[#E0E0E0] px-6 py-6 flex flex-col">

          {/* Welcome */}
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold text-[#333333]">
              Welcome Back!
            </h2>
            <p className="text-xs text-[#333333]/70">
              Please sign in to continue
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-between flex-1"
          >

            {/* TOP SECTION */}
            <div className="space-y-4 w-full">

              {/* Username */}
              <div>
                <label className="text-xs text-[#333333]">Username</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...register("username")}
                    placeholder="Enter your username"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#2F80ED] focus:border-[#2F80ED] outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs text-[#333333]">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-9 py-2 text-sm border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#2F80ED] focus:border-[#2F80ED] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>

            {/* MIDDLE */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#333333]">
                  <input type="checkbox" className="accent-[#2F80ED]" />
                  Remember me
                </label>
                <span className="text-[#2F80ED] cursor-pointer hover:underline">
                  Forgot?
                </span>
              </div>

              {/* Sign In */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#2F80ED] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#256fd1] transition disabled:opacity-50"
              >
                {isPending ? "Signing in..." : "Sign In"}
              </button>
            </div>

            {/* BOTTOM */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 text-[#333333]/50 text-xs">
                <div className="flex-1 h-px bg-[#E0E0E0]"></div>
                OR
                <div className="flex-1 h-px bg-[#E0E0E0]"></div>
              </div>

              {/* Biometric */}
              <button
                type="button"
                className="w-full border border-green-500 text-green-600 py-2 rounded-lg text-sm hover:bg-green-50 transition"
              >
                🔒 Biometric Login
              </button>
            </div>

          </form>

          {/* Footer */}
          <p className="text-center text-[10px] text-[#333333]/50 mt-3">
            © 2024 NZ Tex Group
          </p>

        </div>
      </div>
    </div>
  );
}