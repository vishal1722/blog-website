import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaArrowLeft } from "react-icons/fa";

import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import Comments from "@/components/Comments";
import CommentCount from "@/components/CommentCount";
import BlogLike from "@/components/BlogLike";

const BASE_URL = "http://localhost:8000";

const SingleBlogDetails = () => {
  const navigate = useNavigate();
  const { blogSlug } = useParams();

  const { data, loading, error } = useFetch(
    `${BASE_URL}/api/v1/blogs/blog/${blogSlug}`,
    { method: "GET", credentials: "include" }
  );

  if (loading) return <Loading />;

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Blog not found.
      </div>
    );
  }

  const blog = data.data;
  const blogImageUrl = blog?.featuredImage
    ? `${BASE_URL}${blog.featuredImage}`
    : null;

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm cursor-pointer font-semibold text-gray-600 hover:text-black transition"
        >
          <FaArrowLeft size={12} />
          Back to blogs
        </button>
      </div>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 pb-32">
        {/* Meta Bar */}
        <div className="mt-10 mb-12 flex flex-wrap items-center gap-4 text-sm">
          <span className="px-4 py-1.5 rounded-full bg-black text-white font-semibold tracking-widest uppercase">
            {blog.category.categoryName}
          </span>

          <span className="text-gray-400">
            {moment(blog.createdAt).format("MMMM D, YYYY")}
          </span>

          <div className="ml-auto flex items-center gap-4">
            <CommentCount blogId={blog._id} />
            <BlogLike blogId={blog._id} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-10 bg-gradient-to-br from-black via-gray-800 to-gray-500 bg-clip-text text-transparent">
          {blog.title}
        </h1>

        {/* Author Card */}
        <div className="flex items-center gap-5 p-6 rounded-2xl bg-white shadow-sm border mb-14">
          <img
            src={
              blog?.author?.avtar
                ? `${BASE_URL}${blog.author.avtar}`
                : "/default-user.png"
            }
            alt={blog.author.name}
            className="w-14 h-14 rounded-full object-cover border"
          />

          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">
              {blog.author.name}
            </p>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              {blog.author.role}
            </p>
          </div>
        </div>

        {/* Featured Image */}
        {blogImageUrl && (
          <div className="relative mb-20">
            <img
              src={blogImageUrl}
              alt={blog.title}
              className="w-full aspect-video object-cover rounded-3xl shadow-xl border"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5" />
          </div>
        )}

        {/* Content */}
        <article className="prose prose-zinc prose-lg md:prose-xl max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {blog.content}
          </div>
        </article>

        {/* Divider */}
        <div className="my-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Comments */}
        <section>
          <h2 className="text-2xl font-extrabold mb-8">
            Join the conversation
          </h2>
          <Comments blogId={blog._id} />
        </section>
      </main>
    </div>
  );
};

export default SingleBlogDetails;
