import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCommentAlt, FaTrash, FaSignInAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showError, showLoading, showSuccess } from "@/helper/toast";

export default function Comments({ blogId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  // 🔐 Auth state
  const { isLoggedIn, user } = useSelector((state) => state.user);

  // 🔄 Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/comments/comments/${blogId}`
      );
      setComments(res.data.data);
    } catch (error) {
      showError("Failed to load comments");
    }
  };

  useEffect(() => {
    if (blogId) fetchComments();
  }, [blogId]);

  // ➕ Add comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/sign-in");
      return;
    }

    if (!comment.trim()) {
      showError("Comment cannot be empty");
      return;
    }

    const loadingId = showLoading("Posting comment...");

    try {
      await axios.post(
        "http://localhost:8000/api/v1/comments/add-comment",
        { blogId, comment },
        { withCredentials: true }
      );

      setComment("");
      fetchComments();
      showSuccess("Comment added successfully");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to add comment");
    }
  };

  // ❌ Delete comment
  const handleDelete = async (commentId) => {
    const loadingId = showLoading("Deleting comment...");

    try {
      await axios.delete(
        `http://localhost:8000/api/v1/comments/delete-comment/${commentId}`,
        { withCredentials: true }
      );

      fetchComments();
      showSuccess("Comment deleted");
    } catch (error) {
      showError("Failed to delete comment");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaCommentAlt className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold">Comments</h1>
      </div>

      {/* 🔐 Conditional UI */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Comment as ${user?.name}`}
            rows="3"
            className="w-full border rounded-xl p-4"
          />
          <div className="flex justify-end mt-2">
            <button className="bg-blue-600 cursor-pointer text-white px-5 py-2 rounded-lg">
              Post
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 border rounded-xl p-4 text-center bg-gray-50">
          <p className="mb-3 text-gray-600">
            Please sign in to write a comment
          </p>
          <button
            onClick={() => navigate("/sign-in")}
            className="flex cursor-pointer items-center gap-2 mx-auto bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            <FaSignInAlt />
            Sign In
          </button>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">No comments yet</p>
        ) : (
          comments.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-4 flex justify-between"
            >
              <div>
                <p className="font-semibold">{item.user?.name}</p>
                <p>{item.comment}</p>
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              {/* 🔐 Delete only own comment */}
              {user?._id === item.user?._id && (
                <FaTrash
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 cursor-pointer"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
