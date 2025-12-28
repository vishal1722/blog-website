import React from "react";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { auth, provider } from "@/helpers/firebase";
import { setUser } from "@/redux/user/user.slice";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { RouteIndex } from "@/helpers/RouteName";


const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user;

      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(bodyData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return showToast("error", data.message || "Google login failed");
      }

      dispatch(setUser(data.user));
      showToast("success", data.message || "Login successful");
      navigate(RouteIndex);

    } catch (error) {
      console.error(error);
      showToast("error", error.message || "Google login error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5 mr-3"
      />
      <span className="text-sm font-medium text-gray-700">
        Continue with Google
      </span>
    </button>
  );
};

export default GoogleLogin;
