import React, { useEffect, useState } from "react";
import axios from "axios";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dropzone from "react-dropzone";
import { IoCameraOutline } from "react-icons/io5";

import { showLoading, showSuccess, showError } from "@/helper/toast";
import { getApiMessage } from "@/helper/getApiMessage";
import { useFetch } from "@/hooks/useFetch";

/* ------------------ Validation Schema ------------------ */
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  slug: z.string().min(3, "Slug must be at least 3 characters long."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  category: z.string().min(1, "Category is required"),
});

export default function AddBlog() {
  const navigate = useNavigate();

  /* ------------------ Image State ------------------ */
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  /* ------------------ Fetch Categories ------------------ */
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useFetch("http://localhost:8000/api/v1/category/all", {
    method: "GET",
    credentials: "include",
  });

  const categories = categoryData?.data || [];

  /* ------------------ React Hook Form ------------------ */
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
      title: "",
      slug: "",
      content: "",
      category: "",
    },
  });

  const titleValue = watch("title");

  /* ------------------ Auto Slug ------------------ */
  useEffect(() => {
    if (titleValue?.trim()) {
      setValue(
        "slug",
        slugify(titleValue, {
          lower: true,
          strict: true,
          trim: true,
        }),
        { shouldValidate: true }
      );
    } else {
      setValue("slug", "");
    }
  }, [titleValue, setValue]);

  /* ------------------ Image Cleanup ------------------ */
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  /* ------------------ Image Select ------------------ */
  const handleFileSelection = (files) => {
    const selected = files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      showError("Only image files allowed");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      showError("Image must be under 2MB");
      return;
    }

    setFile(selected);
    setFilePreview(URL.createObjectURL(selected));
  };

  /* ------------------ Submit ------------------ */
  const onSubmit = async (data) => {
    if (!file) {
      showError("Featured image is required");
      return;
    }

    const toastId = showLoading("Creating blog...");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);
      formData.append("category", data.category);
      formData.append("image", file);

      const res = await axios.post(
        "http://localhost:8000/api/v1/blogs/add-blog",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      showSuccess(res?.data?.message || "Blog created successfully", toastId);
      reset();
      setFile(null);
      setFilePreview(null);
      navigate("/blog/detail");
    } catch (error) {
      showError(getApiMessage(error), toastId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:py-12">
      <div className="max-w-xl sm:max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-5 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Add Blog
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="Enter blog title"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-violet-200"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              {...register("slug")}
              placeholder="Auto generated slug"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 ${
                errors.slug
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-violet-200"
              }`}
            />
            {errors.slug && (
              <p className="text-xs text-red-500 mt-1">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("category")}
              disabled={categoryLoading}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 ${
                errors.category
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-violet-200"
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="text-xs text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}

            {categoryError && (
              <p className="text-xs text-red-500 mt-1">
                Failed to load categories
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              {...register("content")}
              placeholder="Write blog content..."
              className={`w-full rounded-lg border px-4 py-2.5 text-sm resize-none focus:ring-2 ${
                errors.content
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-violet-200"
              }`}
            />
            {errors.content && (
              <p className="text-xs text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Featured Image <span className="text-red-500">*</span>
            </label>

            <Dropzone onDrop={handleFileSelection} multiple={false}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="cursor-pointer text-center">
                  <input {...getInputProps()} />

                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-4 border-violet-200 group">
                    <img
                      src={filePreview || "https://via.placeholder.com/150"}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/30">
                      <IoCameraOutline className="text-white text-xl" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Tap to upload (PNG/JPG up to 2MB)
                  </p>
                </div>
              )}
            </Dropzone>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
