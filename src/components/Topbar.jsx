import React from "react";
import logo from "@/assets/images/logo-white.png";
import { Link, useNavigate } from "react-router-dom";
import { CiLogin, CiLogout, CiEdit, CiUser } from "react-icons/ci";
import SearchBox from "./SearchBox";
import { Button } from "@/components/ui/button";

import {
  RouteSignin,
  RouteProfile,
  RouteEditBlog,
 
} from "@/helpers/RouteName";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "@/redux/user/user.slice";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(removeUser());
    sessionStorage.clear();
    navigate(RouteSignin);
  };

  return (
    <div className="flex justify-between items-center h-16 fixed w-full z-20 bg-white px-6 shadow-sm">

      {/* Logo */}
      <img src={logo} alt="Logo" className="h-10" />

      {/* Search */}
      <SearchBox />

      {/* Right */}
      {isLoggedIn ? (
        <div className="relative group">

          {/* Avatar */}
          <img
            src={
              user?.avatar ||
              "https://api.dicebear.com/7.x/initials/svg?seed=User"
            }
            alt="Profile"
            className="w-9 h-9 rounded-full border cursor-pointer"
          />

          {/* Dropdown */}
          <div
            className="
              absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-lg
              opacity-0 scale-95 invisible
              group-hover:opacity-100 group-hover:scale-100 group-hover:visible
              transition-all duration-200 ease-out
            "
          >
            {/* User Info */}
            <div className="p-4 border-b">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            {/* Actions */}
            <div className="p-2 space-y-1">

              {/* Profile */}
              <Link
                to={RouteProfile}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
              >
                <CiUser className="text-lg" />
                Profile
              </Link>

              {/* Edit Blog */}
              <Link
                to={RouteEditBlog}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
              >
                <CiEdit className="text-lg" />
                Edit Blog
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                <CiLogout className="text-lg" />
                Logout
              </button>

            </div>
          </div>
        </div>
      ) : (
        <Button asChild variant="default" className="rounded-full px-5 gap-2">
          <Link to={RouteSignin}>
            <CiLogin className="size-5" />
            Sign In
          </Link>
        </Button>
      )}
    </div>
  );
};

export default Topbar;
