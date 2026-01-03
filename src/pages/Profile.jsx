import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setUser } from "@/redux/user/user.slice";
import { Eye, EyeOff } from "lucide-react";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    password: "",
    avatar: user?.avatar || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({
      ...formData,
      avatar: URL.createObjectURL(file),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setUser(formData));
    alert("Profile updated successfully ✅");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto mt-24 px-6"
    >
      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-3xl font-bold mb-8 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <motion.img
              src={
                formData.avatar ||
                "https://api.dicebear.com/7.x/initials/svg?seed=User"
              }
              alt="Avatar"
              className="w-28 h-28 rounded-full border object-cover"
              whileHover={{ scale: 1.08 }}
            />

            <label className="cursor-pointer bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Name */}
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell something about yourself..."
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password"
                className="w-full border rounded-xl px-4 py-2 pr-10 focus:ring-2 focus:ring-black outline-none"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Save Changes
          </motion.button>

        </form>
      </div>
    </motion.div>
  );
};

/* Reusable Input Component */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black outline-none"
      required
    />
  </div>
);

export default EditProfile;
