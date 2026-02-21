import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import Dropzone from "react-dropzone";
import { IoCameraOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { showSuccess, showError } from "../helper/toast.js";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/user_slice.js";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const userId = user?.user?._id;

  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);

  const {
    data: userData,
    loading,
    error,
    refetch,
  } = useFetch(
    userId ? `http://localhost:8000/api/v1/user/get-user/${userId}` : null,
    { method: "GET", credentials: "include" },
    [userId],
  );

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 character long."),
    email: z.string().email("Invalid email address"),
    bio: z.string().min(3, "Bio must be at least 3 character long."),
    password: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData?.success) {
      reset({
        name: userData?.data?.name || "",
        email: userData?.data?.email || "",
        bio: userData?.data?.bio || "",
        password: "",
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);


  const avatarSrc = useMemo(() => {
    if (filePreview) return filePreview;

    const avtar = userData?.data?.avtar;


    if (avtar?.startsWith("http://") || avtar?.startsWith("https://")) {
      return avtar;
    }


    if (avtar) {
      return `http://localhost:8000${avtar}`;
    }

    return "https://via.placeholder.com/150";
  }, [filePreview, userData]);

  const handleFileSelection = (files) => {
    const selected = files?.[0];
    if (!selected) return;

    if (!selected.type?.includes("image/")) {
      showError("Only image files allowed!");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      showError("Image must be under 2MB!");
      return;
    }

    const preview = URL.createObjectURL(selected);
    setFile(selected);
    setFilePreview(preview);
  };

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();

      if (file) formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await fetch(
        `http://localhost:8000/api/v1/user/update-user/${userId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return showError(data?.message || "Update failed");
      }

      // ✅ redux update
      dispatch(setUser(data.data));

      showSuccess(data?.message || "Profile updated successfully");

      setValue("password", "");
      setFile(null);
      setFilePreview(null);
      navigate("/");
      refetch?.();
    } catch (err) {
      showError(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-screen-md mx-auto mt-10 px-4">
      <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Profile Settings
        </h2>

        {/* Avatar */}
        <div className="flex justify-center items-center mb-10 w-full">
          <Dropzone onDrop={handleFileSelection} multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <input {...getInputProps()} />

                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-violet-200 group">
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150";
                    }}
                  />

                  <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <IoCameraOutline className="text-violet-600 text-xl" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Click to upload (PNG/JPG up to 2MB)
                </p>
              </div>
            )}
          </Dropzone>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter your name"
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-violet-200 transition
                ${errors.name ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email address"
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-violet-200 transition
                ${errors.email ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              {...register("bio")}
              rows={4}
              placeholder="Write something about you..."
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 resize-none
                focus:outline-none focus:ring-2 focus:ring-violet-200 transition
                ${errors.bio ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.bio && (
              <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter new password (optional)"
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-violet-200 transition
                ${errors.password ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full cursor-pointer py-2.5 rounded-xl text-white font-semibold transition active:scale-[0.98]
              ${
                isSubmitting
                  ? "bg-violet-400 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
