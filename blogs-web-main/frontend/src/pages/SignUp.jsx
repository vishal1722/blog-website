import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

import { showLoading, showSuccess, showError } from "../helper/toast.js";
import { getApiMessage } from "../helper/getApiMessage.js";
import GoogleLogin from "@/components/GoogleLogin.jsx";

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = showLoading("Creating account...");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/v1/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      );
      showSuccess(res.data.message, toastId);
      reset();
      navigate("/sign-in");
    } catch (error) {
      showError(getApiMessage(error), toastId);
    }
  };

  const inputStyle =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500 outline-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-xl border bg-white p-8 shadow-lg">
        {/* Title */}
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Create Your Account
        </h1>

        {/* Google Button
        <button className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border py-2.5 text-sm font-medium hover:bg-gray-50">
          <FcGoogle size={20} />
          Continue With Google
        </button> */}
        <GoogleLogin />

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="px-3 text-sm text-gray-400">Or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="Enter your name"
              className={inputStyle}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Enter your email address"
              className={inputStyle}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className={inputStyle}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Enter password again"
              className={inputStyle}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg cursor-pointer bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-70"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600 ">
          Already have account?{" "}
          <Link
            to="/sign-in"
            className="font-medium text-violet-600 hover:underline cursor-pointer"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
