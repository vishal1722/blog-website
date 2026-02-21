import React from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { useFetch } from "@/hooks/useFetch";

const BASE_URL = "http://localhost:8000";

export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const { data, loading, error } = useFetch(
    `${BASE_URL}/api/v1/blogs/search?q=${query}`
  );

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        Failed to load search results
      </div>
    );
  }

  const blogs = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Search results for: <span className="text-violet-600">{query}</span>
      </h2>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} props={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
}
