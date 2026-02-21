import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import userBlog from "../models/user_model.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await userBlog.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userBlog.create({
    name,
    email,
    password: hashedPassword,
  });

  res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await userBlog.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // ✅ FIXED COOKIE
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ VERY IMPORTANT
    path: "/",
  });

  return res.status(200).json(
    new ApiResponse(200, { user }, "Login successful")
  );
});


export const googleLogin = asyncHandler(async (req, res) => {
  const { email, name, avtar } = req.body;

  if (!email || !name) {
    throw new ApiError(400, "Email and name are required");
  }

  let user = await userBlog.findOne({ email });

  if (!user) {
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user = await userBlog.create({
      name,
      email,
      avtar,
      password: hashedPassword,
    });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ FIXED
    path: "/",
  });

  return res.status(200).json(
    new ApiResponse(200, { user }, "Login successful")
  );
});


export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});
