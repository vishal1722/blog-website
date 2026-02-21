import React from "react";
import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { useFetch } from "@/hooks/useFetch";
import { allBlogs } from "@/api/allApi.js";
const Index = () => {
  const { data, loading, error } = useFetch(
    allBlogs,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-center text-red-500 text-base sm:text-lg">
          Failed to load blogs
        </p>
      </div>
    );
  }

  const blogs = data?.data || [];

  return (
    <section className="w-full">
      <div className="
        max-w-7xl 
        mx-auto 
        px-4 
        sm:px-6 
        lg:px-8 
        py-8 
        sm:py-10
      ">
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

export default Index;
