import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
export default function AuthProtection() {
  const user = useSelector((state) => state.user);
  if (user && user.isLoggedIn) {
    return <Outlet />;
  } else {
    return <Navigate to="/sign-in" />;
  }
}
