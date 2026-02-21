import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import logo from "@/assets/images/logo-white.png";
import usericon from "@/assets/images/user.png";

import { MdLogin } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";

import {
  RouteBlogAdd,
  RoutesName,
  RouteProfile,
  signIn,
} from "@/helper/RoutesName";

import { setLogout } from "@/redux/user_slice";
import { showLoading, showSuccess, showError } from "@/helper/toast";

/* ✅ RECEIVE onMenuClick PROP */
const Topbar = ({ onMenuClick }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [query, setQuery] = useState("");

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const avatarUrl = useMemo(() => {
    const avtar = user?.user?.avtar;
    if (!avtar) return usericon;
    if (avtar.startsWith("http")) return avtar;
    return `http://localhost:8000${avtar}`;
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpenDropdown(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setShowSearch(false);
    setQuery("");
  };

  const handleLogout = async () => {
    const toastId = showLoading("Logging out...");
    try {
      await axios.get("http://localhost:8000/api/auth/v1/logout", {
        withCredentials: true,
      });
      dispatch(setLogout());
      showSuccess("Logout successful", toastId);
      navigate(RoutesName);
    } catch {
      showError("Logout failed", toastId);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="h-16 px-5 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* ✅ MOBILE MENU BUTTON */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <AiOutlineMenu size={20} />
          </button>

          <Link to={RoutesName}>
            <img src={logo} alt="logo" className="h-10 " />
          </Link>
        </div>

        {/* DESKTOP SEARCH */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center w-[520px] bg-slate-100 border rounded-2xl px-4 py-2 gap-3"
        >
          <IoMdSearch size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blogs..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </form>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSearch((p) => !p)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <IoMdSearch size={22} />
          </button>

          {!user?.isLoggedIn ? (
            <Link
              to={signIn}
              className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-full"
            >
              <MdLogin /> Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown((p) => !p)}
                className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 rounded-full"
              >
                <img
                  src={avatarUrl}
                  alt="user"
                  className="h-10 w-10 cursor-pointer rounded-full object-cover border"
                  onError={(e) => (e.currentTarget.src = usericon)}
                />
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white border rounded-2xl shadow-xl">
                  <div className="p-4 border-b">
                    <p className="font-bold">{user?.user?.name}</p>
                    <p className="text-sm text-slate-500">
                      {user?.user?.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      to={RouteProfile}
                      onClick={() => setOpenDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100"
                    >
                      <FaRegUser /> Profile
                    </Link>

                    <Link
                      to={RouteBlogAdd}
                      onClick={() => setOpenDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100"
                    >
                      <FaPlus /> Create Blog
                    </Link>

                    <div className="h-px bg-slate-200 my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50"
                    >
                      <IoLogOutOutline size={20} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {showSearch && (
        <div className="md:hidden px-5 pb-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-slate-100 border rounded-2xl px-4 py-2 gap-3"
          >
            <IoMdSearch size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </form>
        </div>
      )}
    </header>
  );
};

export default Topbar;
