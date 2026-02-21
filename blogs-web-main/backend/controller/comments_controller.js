import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import { Comment } from "../models/comments_model.js";

export const addComment = asyncHandler(async (req, res) => {
  const { blogId, comment } = req.body;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }

  if (!comment || !comment.trim()) {
    throw new ApiError(400, "Comment is required");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const newComment = await Comment.create({
    blogId,
    comment: comment.trim(),
    user: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

export const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }

  const comments = await Comment.find({ blogId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 🔐 Only owner can delete
  if (comment.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export const commentCount = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }
  const count = await Comment.countDocuments({ blogId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { count }, "Comment count fetched successfully"),
    );
});
