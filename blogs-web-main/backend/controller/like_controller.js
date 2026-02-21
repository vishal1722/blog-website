import { Like } from "../models/likes_models.js"
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import mongoose from "mongoose";

export const getLikeInfo = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog id");
  }

  const count = await Like.countDocuments({ blog: blogId });

  let isLiked = false;
  if (userId) {
    const liked = await Like.findOne({ blog: blogId, user: userId });
    isLiked = !!liked;
  }

  return res.status(200).json(
    new ApiResponse(200, { count, isLiked }, "Like info fetched")
  );
};


export const toggleLike = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Login required");
  }

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog id");
  }

  const existingLike = await Like.findOne({
    blog: blogId,
    user: userId,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });

    return res.status(200).json(
      new ApiResponse(200, {}, "Like removed")
    );
  }

  await Like.create({
    blog: blogId,
    user: userId,
  });

  return res.status(201).json(
    new ApiResponse(201, {}, "Blog liked")
  );
};
