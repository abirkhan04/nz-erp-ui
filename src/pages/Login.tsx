import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    console.log("Login Data:", data);

    // Fake success login
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 bg-cover bg-center bg-no-repeat"
    style={{
        backgroundImage: "url('/images/login-bg.jpg')",
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          NZ ERP Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              {...register("email")}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Any credentials will work (mock login)
        </p>
      </div>
    </div>
  );
}