import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import Logo from "../assets/images/logo-white.png";
import { signUp } from "../helper/RoutesName.js";
import { showLoading, showSuccess, showError } from "../helper/toast.js";
import { getApiMessage } from "../helper/getApiMessage.js";
import GoogleLogin from "@/components/GoogleLogin";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user_slice";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = showLoading("Logging in...");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/v1/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      showSuccess(res.data.message || "Login successful", toastId);
      dispatch(setUser(res.data.data.user));
      reset();
      navigate("/");
    } catch (error) {
      showError(getApiMessage(error), toastId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <Link to="/"><div className="flex justify-center mb-6">
          <img src={Logo} alt="App Logo" className="h-12" />
        </div></Link>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Login to your account
        </h1>
        <p className="text-center text-slate-500 mb-6 text-sm">
          Welcome back, please enter your details
        </p>

        {/* Google Login */}
        <GoogleLogin />

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-slate-300 flex-1" />
          <span className="text-slate-400 text-sm font-medium">OR</span>
          <div className="h-px bg-slate-300 flex-1" />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email", { required: true })}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { required: true })}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-violet-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-violet-600 text-white rounded-lg py-3 font-semibold hover:bg-violet-700 transition shadow-md disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to={signUp}
            className="text-violet-600 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
