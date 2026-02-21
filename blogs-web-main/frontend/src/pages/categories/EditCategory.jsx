import React, { useEffect } from "react";
import axios from "axios";
import slugify from "slugify";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { showLoading, showSuccess, showError } from "../../helper/toast.js";
import { getApiMessage } from "../../helper/getApiMessage.js";
import { RouteCategoryDetails } from "../../helper/RoutesName.js";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  slug: z.string().min(3, "Slug must be at least 3 characters long."),
});

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const nameValue = watch("name");

  /* 🔹 SAME slug auto-generate logic */
  useEffect(() => {
    if (nameValue?.trim()) {
      const slug = slugify(nameValue, {
        lower: true,
        strict: true,
        trim: true,
      });
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, setValue]);

  /* 🔹 Load category data */
  useEffect(() => {
    const fetchCategory = async () => {
      const toastId = showLoading("Loading category...");
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/category/all",
          { withCredentials: true }
        );

        const category = res.data?.data?.find((c) => c._id === id);

        if (!category) {
          showError("Category not found", toastId);
          navigate(RouteCategoryDetails);
          return;
        }

        reset({
          name: category.categoryName,
          slug: category.slug,
        });

        showSuccess("Category loaded", toastId);
      } catch (error) {
        showError(getApiMessage(error), toastId);
      }
    };

    fetchCategory();
  }, [id, navigate, reset]);

  /* 🔹 Submit update */
  const onSubmit = async (data) => {
    const toastId = showLoading("Updating category...");

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/category/edit/${id}`,
        {
          categoryName: data.name,
          slug: data.slug,
        },
        { withCredentials: true }
      );

      showSuccess(res?.data?.message || "Category updated", toastId);
      navigate(RouteCategoryDetails);
    } catch (error) {
      showError(getApiMessage(error), toastId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Category
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              {...register("name")}
              className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 transition ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-violet-200"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Auto generated slug"
              {...register("slug")}
              className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 transition ${
                errors.slug
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-violet-200"
              }`}
            />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
