// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import userBlog from "../models/user_model.js";
import { ApiError } from "../utils/api_error.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userBlog.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};
