import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, RefreshCcw } from "lucide-react";

import { RouteBlogAdd, RoutesBlogEdit } from "@/helper/RoutesName";
import { useFetch } from "@/hooks/useFetch";
import { getApiMessage } from "@/helper/getApiMessage";
import { showLoading, showSuccess, showError } from "@/helper/toast";

export default function DetailBlog() {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { data, loading, error, refetch } = useFetch(
    "http://localhost:8000/api/v1/blogs/all-blogs",
    { method: "GET", credentials: "include" }
  );

  const blogs = data?.data || [];

  const filteredBlogs = useMemo(() => {
    if (!search.trim()) return blogs;
    const q = search.toLowerCase();
    return blogs.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.slug?.toLowerCase().includes(q)
    );
  }, [blogs, search]);

  const handleRefresh = async () => {
    const toastId = showLoading("Refreshing blogs...");
    try {
      await refetch();
      showSuccess("Blogs refreshed", toastId);
    } catch {
      showError("Failed to refresh blogs", toastId);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    const toastId = showLoading("Deleting blog...");
    try {
      setDeletingId(id);

      const res = await fetch(
        `http://localhost:8000/api/v1/blogs/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        showError(json?.message || "Delete failed", toastId);
        return;
      }

      showSuccess("Blog deleted successfully", toastId);
      refetch();
    } catch (err) {
      showError(err?.message || "Something went wrong", toastId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Blogs
          </h1>
          <p className="text-sm text-gray-500">
            Manage blogs – create, edit & delete
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 cursor-pointer"
          >
            <RefreshCcw size={16} /> Refresh
          </button>

          <Link to={RouteBlogAdd}>
            <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer">
              + Add Blog
            </button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or slug..."
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading && <p className="text-gray-500">Loading blogs...</p>}

      {!loading && error && (
        <p className="text-red-600">{getApiMessage(error)}</p>
      )}

      {!loading && !error && filteredBlogs.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No blogs found
        </p>
      )}

      {/* DESKTOP TABLE */}
      {!loading && !error && filteredBlogs.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 text-left">Title</th>
                <th className="px-5 py-3 text-left">Slug</th>
                <th className="px-5 py-3 text-left">Author</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold">
                    {blog.title}
                  </td>

                  <td className="px-5 py-3 text-gray-600">
                    {blog.slug}
                  </td>

                  <td className="px-5 py-3 text-gray-700">
                    {blog.author?.name || "Unknown"}
                  </td>

                  <td className="px-5 py-3 flex justify-center gap-3">
                    <Link to={RoutesBlogEdit(blog._id)}>
                      <button className="p-2 cursor-pointer rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                        <Pencil size={16} />
                      </button>
                    </Link>

                    <button
                      disabled={deletingId === blog._id}
                      onClick={() => handleDelete(blog._id)}
                      className={`p-2 cursor-pointer rounded-lg ${
                        deletingId === blog._id
                          ? "bg-red-300"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {deletingId === blog._id ? "..." : <Trash2 size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-900">{blog.title}</h3>

            <p className="text-sm text-gray-600">
              Author: {blog.author?.fullName || "Unknown"}
            </p>

            <p className="text-sm text-gray-500 break-all">
              {blog.slug}
            </p>

            <div className="flex gap-3 mt-4">
              <Link to={RoutesBlogEdit(blog._id)}>
                <button className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <Pencil size={16} />
                </button>
              </Link>

              <button
                disabled={deletingId === blog._id}
                onClick={() => handleDelete(blog._id)}
                className={`p-2 rounded-lg ${
                  deletingId === blog._id
                    ? "bg-red-300"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {deletingId === blog._id ? "..." : <Trash2 size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
