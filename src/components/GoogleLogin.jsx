import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log("Login Success:", data);
      navigate("/");

    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  return (
    <button
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
