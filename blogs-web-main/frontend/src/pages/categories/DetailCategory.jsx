// src/pages/category/DetailCategory.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, RefreshCcw } from "lucide-react";

import { RouteCategoryAdd, RouteCategoryEdit } from "@/helper/RoutesName";
import { useFetch } from "@/hooks/useFetch";
import { getApiMessage } from "@/helper/getApiMessage";
import { showLoading, showSuccess, showError } from "@/helper/toast";

export default function DetailCategory() {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { data, loading, error, refetch } = useFetch(
    "http://localhost:8000/api/v1/category/all",
    { method: "GET", credentials: "include" }
  );

  const categories = data?.data || [];

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.categoryName.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
    );
  }, [categories, search]);

  // 🔥 Refresh with toast
  const handleRefresh = async () => {
    const toastId = showLoading("Refreshing categories...");
    try {
      await refetch();
      showSuccess("Categories refreshed", toastId);
    } catch {
      showError("Failed to refresh", toastId);
    }
  };

  // 🔥 Delete with toast
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    const toastId = showLoading("Deleting category...");
    try {
      setDeletingId(id);

      const res = await fetch(
        `http://localhost:8000/api/v1/category/delete/${id}`,
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

      showSuccess("Category deleted successfully", toastId);
      refetch();
    } catch (err) {
      showError(err?.message || "Something went wrong", toastId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">
            Create, edit, delete and search categories
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100"
          >
            <RefreshCcw size={16} /> Refresh
          </button>

          <Link to={RouteCategoryAdd}>
            <button className="px-5 cursor-pointer py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold">
              + Add Category
            </button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or slug..."
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* States */}
      {loading && <p className="text-gray-500">Loading categories...</p>}

      {!loading && error && (
        <p className="text-red-600">{getApiMessage(error)}</p>
      )}

      {!loading && !error && filteredCategories.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No categories found
        </p>
      )}

      {/* Table */}
      {!loading && !error && filteredCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 text-left">Category Name</th>
                <th className="px-5 py-3 text-left">Slug</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-5 py-3 font-semibold">
                    {cat.categoryName}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {cat.slug}
                  </td>

                  <td className="px-5 py-3 flex justify-center gap-3">
                    <Link to={RouteCategoryEdit(cat._id)}>
                      <button className="p-2 cursor-pointer rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                        <Pencil size={16} />
                      </button>
                    </Link>

                    <button
                      disabled={deletingId === cat._id}
                      onClick={() => handleDelete(cat._id)}
                      className={`p-2 cursor-pointer rounded-lg transition
                        ${
                          deletingId === cat._id
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                    >
                      {deletingId === cat._id ? "..." : <Trash2 size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
