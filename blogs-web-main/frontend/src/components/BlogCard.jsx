import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from "moment";
import { Link } from "react-router-dom";

import usericon from "../assets/images/user.png";
import { RouteBlogDetailspage } from "../helper/RoutesName";

const BASE_URL = "http://localhost:8000";

const BlogCard = ({ props }) => {
  const avatarUrl = props?.author?.avtar
    ? `${BASE_URL}${props.author.avtar}`
    : usericon;

  const blogImageUrl = props?.featuredImage
    ? `${BASE_URL}${props.featuredImage}`
    : "https://via.placeholder.com/600x400";

  return (
    <Link
      to={RouteBlogDetailspage(props?.category?.slug, props?.slug)}
      className="group block h-full"
    >
      <div
        className="w
          h-full
          bg-white
          rounded-2xl
          overflow-hidden
          border border-gray-100
          shadow-sm
          transition-all duration-300
          hover:shadow-2xl
          hover:-translate-y-1
          flex flex-col
        "
      >
        {/* IMAGE */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={blogImageUrl}
            alt={props?.title}
            className="
              w-full h-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* CATEGORY */}
          <span
            className="
              absolute top-3 left-3
              bg-white/90 backdrop-blur
              text-gray-900
              text-xs font-semibold
              px-3 py-1
              rounded-full
            "
          >
            {props?.category?.categoryName}
          </span>

          {/* ADMIN BADGE */}
          {props?.author?.role === "admin" && (
            <span
              className="
                absolute top-3 right-3
                bg-violet-600
                text-white
                text-xs font-semibold
                px-3 py-1
                rounded-full
              "
            >
              Admin
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-4 sm:p-5 gap-4">
          {/* TITLE */}
          <h2
            className="
              text-base sm:text-lg
              font-bold
              text-gray-900
              leading-snug
              line-clamp-2
              group-hover:text-violet-600
              transition
            "
          >
            {props?.title}
          </h2>

          {/* META */}
          <div className="flex items-center justify-between gap-3 text-sm">
            {/* AUTHOR */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={avatarUrl}
                alt="author"
                onError={(e) => (e.currentTarget.src = usericon)}
                className="w-9 h-9 rounded-full object-cover border"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {props?.author?.name}
                </p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>

            {/* DATE */}
            <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
              <FaRegCalendarAlt />
              {moment(props?.createdAt).format("DD MMM")}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t">
            <button
              className="
                w-full
                py-2.5
                rounded-xl
                text-sm font-semibold
                bg-violet-600
                text-white
                hover:bg-violet-700
                transition
              "
            >
              Read Full Blog →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
