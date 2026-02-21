import React from "react";
import { useParams } from "react-router-dom";

import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { useFetch } from "@/hooks/useFetch";

const BASE_URL = "http://localhost:8000";

const BlogbyCategory = () => {
  const { categorySlug } = useParams();

  const { data, loading, error } = useFetch(
    `${BASE_URL}/api/v1/blogs/getblogbycategory/${categorySlug}`
  );

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-center text-red-500 text-sm sm:text-base">
          Failed to load blogs
        </p>
      </div>
    );
  }

  const blogs = data?.data || [];
  const categoryName =
    blogs[0]?.category?.categoryName || categorySlug;

  return (
    <section className="w-full">
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          sm:py-8
        "
      >
        {/* TITLE */}
        <h2 className="text-lg sm:text-2xl font-bold mb-6 capitalize">
          Category: {categoryName}
        </h2>

        {blogs.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-6
              sm:gap-8
            "
          >
            {blogs.map((blog) => (
              <BlogCard key={blog._id} props={blog} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-gray-500 text-sm sm:text-base">
              No blogs found
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogbyCategory;
