import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "@/assets/images/logo-white.png";
import { allCategories } from "@/api/allApi.js";
import { LayoutDashboard, Layers, PenTool, Users2, Tag, X } from "lucide-react";

import { RouteCategoryDetails } from "@/helper/RoutesName";
import { useFetch } from "@/hooks/useFetch";

/* 🔹 NAV CONFIG */
const baseLinks = [{ title: "Dashboard", icon: LayoutDashboard, path: "/" }];

const userLinks = [{ title: "Blogs", icon: PenTool, path: "/blog/detail" }];

const adminLinks = [
  { title: "Categories", icon: Layers, path: RouteCategoryDetails },
  { title: "Users", icon: Users2, path: "/user" },
];

export default function AppSidebar({ isOpen, onClose }) {
  const { isLoggedIn, user } = useSelector((state) => state.user || {});
  const role = user?.role;

  const { data, loading, error } = useFetch(
    allCategories,
    { method: "GET", credentials: "include" },
  );

  const categories = data?.data || [];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `relative flex items-center gap-4 px-5 py-3 rounded-xl font-medium transition-all
        ${
          isActive
            ? "bg-violet-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r" />
          )}
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <img src={logo} alt="logo" className="h-9" />
          <button onClick={onClose} className="lg:hidden text-slate-600">
            <X />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-4rem)] px-3 py-4 overflow-y-auto space-y-6">
          {/* Main */}
          <div className="space-y-1">
            {baseLinks.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </div>

          {/* User */}
          {isLoggedIn && (
            <div>
              <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase">
                Content
              </p>
              <div className="space-y-1">
                {userLinks.map((item) => (
                  <NavItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Admin */}
          {isLoggedIn && role === "admin" && (
            <div>
              <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase">
                Admin
              </p>
              <div className="space-y-1">
                {adminLinks.map((item) => (
                  <NavItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div>
            <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase">
              Categories
            </p>

            {loading && (
              <p className="px-4 text-sm text-slate-400">Loading...</p>
            )}

            {error && (
              <p className="px-4 text-sm text-red-500">
                Failed to load categories
              </p>
            )}

            <div className="space-y-1">
              {categories.map((cat) => (
                <NavLink
                  key={cat._id}
                  to={`/blog/category/${cat.slug}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-2.5 rounded-lg text-sm transition
                    ${
                      isActive
                        ? "bg-violet-50 text-violet-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <Tag className="h-4 w-4" />
                  {cat.categoryName}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
