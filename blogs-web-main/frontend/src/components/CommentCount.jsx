import React from "react";
import { useFetch } from "@/hooks/useFetch";

const BASE_URL = "http://localhost:8000";

export default function CommentCount({ blogId }) {
  const { data, loading, error } = useFetch(
    `${BASE_URL}/api/v1/comments/count/${blogId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (loading) return <span>Loading...</span>;
  if (error) return <span>0 Comments</span>;

  return (
    <span className="font-medium cursor-pointer">
      {data?.data?.count ?? 0} Comments
    </span>
  );
}
