import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RouteSignup } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";

/* 🔹 SIGN-IN VALIDATION */
const SigninSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signin = () => {
  const navigate = useNavigate(); // ✅ hook at top level

  const form = useForm({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.username, // backend expects email
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message || "Signin failed");
        return;
      }

      showToast("success", "Signin successful");

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (error) {
      console.error("Error during signin:", error);
      showToast("error", "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-10 w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link to={RouteSignup} className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signin;
