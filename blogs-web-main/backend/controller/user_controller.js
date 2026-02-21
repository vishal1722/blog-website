import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import userBlog from "../models/user_model.js";


export const getuser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userBlog.findById(id).select("-password").lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, email, bio, password } = JSON.parse(req.body.data || "{}");
  const file = req.file;

  const updateData = { name, email, bio };

  if (password && password.trim() !== "") {
    updateData.password = password;
  }


  if (file) {
    updateData.avtar = `/uploads/avatars/${file.filename}`;
  }

  const updatedUser = await userBlog
    .findByIdAndUpdate(id, updateData, { new: true })
    .select("-password")
    .lean();

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userBlog
    .find()
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully")
  );
});
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userBlog.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "User deleted successfully")
  );
});
