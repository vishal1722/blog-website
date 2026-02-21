import { auth, provider } from "@/helper/firebase";
import { getApiMessage } from "@/helper/getApiMessage";
import { showError, showLoading, showSuccess } from "@/helper/toast";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user_slice";
export default function GoogleLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    const toastId = showLoading("Logging in...");
    try {
      const GoogleResponse = await signInWithPopup(auth, provider);

      const res = await axios.post(
        "http://localhost:8000/api/auth/v1/google-login",
        {
          email: GoogleResponse.user.email,
          name: GoogleResponse.user.displayName,
          avtar: GoogleResponse.user.photoURL,
        },
        { withCredentials: true }
      );

      showSuccess(res.data.message || "Login successful", toastId);
      dispatch(setUser(res.data.data.user));
      navigate("/");
    } catch (error) {
      showError(getApiMessage(error), toastId);
    }
  };
  return (
    <button
      onClick={handleLogin}
      className="mt-6 flex cursor-pointer w-full items-center justify-center gap-3 rounded-lg border py-2.5 text-sm font-medium hover:bg-gray-50"
    >
      <FcGoogle size={20} />
      Continue With Google
    </button>
  );
}
