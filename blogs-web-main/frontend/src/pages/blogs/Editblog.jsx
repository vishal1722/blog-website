import React, { useEffect } from "react";
import axios from "axios";
import slugify from "slugify";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { showLoading, showSuccess, showError } from "@/helper/toast";
import { getApiMessage } from "@/helper/getApiMessage";
import { RouteBlogDetails } from "@/helper/RoutesName";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  image: z.any().optional(),
});

export default function EditBlog() {
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
    resolver: zodResolver(schema),
  });

  const titleValue = watch("title");

  /* 🔹 Auto slug */
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
    }
  }, [titleValue, setValue]);

  /* 🔹 Load blog */
  useEffect(() => {
    const fetchBlog = async () => {
      const toastId = showLoading("Loading blog...");
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/blogs/${id}`,
          { withCredentials: true }
        );

        const blog = res.data.data;

        reset({
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
        });

        showSuccess("Blog loaded", toastId);
      } catch (err) {
        showError(getApiMessage(err), toastId);
      }
    };

    fetchBlog();
  }, [id, reset]);

  /* 🔹 Submit */
  const onSubmit = async (data) => {
    const toastId = showLoading("Updating blog...");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/blogs/edit/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      showSuccess(res.data.message, toastId);
      navigate("/blog/detail");
    } catch (err) {
      showError(getApiMessage(err), toastId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          w-full
          max-w-lg sm:max-w-xl
          mx-auto
          bg-white
          rounded-2xl
          shadow-lg
          p-5 sm:p-8
          space-y-4 sm:space-y-5
        "
      >
        <h2 className="text-lg sm:text-xl font-bold text-center">
          Edit Blog
        </h2>

        {/* Title */}
        <div>
          <input
            placeholder="Title"
            {...register("title")}
            className="
              w-full
              rounded-lg
              border
              px-4 py-2.5
              text-sm
              focus:ring-2
              focus:ring-violet-200
            "
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div>
          <input
            placeholder="Slug"
            {...register("slug")}
            className="
              w-full
              rounded-lg
              border
              px-4 py-2.5
              text-sm
              focus:ring-2
              focus:ring-violet-200
            "
          />
          {errors.slug && (
            <p className="text-xs text-red-500 mt-1">
              {errors.slug.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <textarea
            rows={5}
            placeholder="Content"
            {...register("content")}
            className="
              w-full
              rounded-lg
              border
              px-4 py-2.5
              text-sm
              resize-none
              focus:ring-2
              focus:ring-violet-200
            "
          />
          {errors.content && (
            <p className="text-xs text-red-500 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Image */}
        <div>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="text-sm"
          />
        </div>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          className="
            w-full
            bg-violet-600
            hover:bg-violet-700
            text-white
            py-2.5
            rounded-lg
            font-semibold
            text-sm
            disabled:opacity-60
          "
        >
          {isSubmitting ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
