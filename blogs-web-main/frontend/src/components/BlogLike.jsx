import React from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";

import { useFetch } from "@/hooks/useFetch";
import { showSuccess, showError } from "@/helper/toast";

const BASE_URL = "http://localhost:8000";

export default function BlogLike({ blogId }) {
  const { data, loading, refetch } = useFetch(
    `${BASE_URL}/api/v1/likes/${blogId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const totalLikes = data?.data?.count || 0;
  const isLiked = data?.data?.isLiked || false;

  const handleLike = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/v1/likes/toggle/${blogId}`,
        {},
        { withCredentials: true }
      );

      refetch();
      showSuccess(isLiked ? "Like removed" : "Liked ❤️");
    } catch {
      showError("Login required to like");
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={handleLike}
      aria-label={isLiked ? "Unlike blog" : "Like blog"}
      className="
        flex items-center gap-1.5 sm:gap-2
        px-2.5 py-1.5 sm:px-3 sm:py-2
        rounded-full
        text-xs sm:text-sm
        font-semibold
        transition-all
        active:scale-95
        hover:bg-red-50
      "
    >
      <FaHeart
        className={`
          transition-transform
          text-base sm:text-lg cursor-pointer
          ${
            isLiked
              ? "text-red-500 scale-110"
              : "text-gray-400 hover:text-red-400"
          }
        `}
      />
      <span className="text-gray-700 min-w-[12px] text-center">
        {totalLikes}
      </span>
    </button>
  );
}
