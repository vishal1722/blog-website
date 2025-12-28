import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setUser } from "@/redux/user/user.slice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setFormData({ ...formData, avatar: previewURL });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later: API call
    dispatch(setUser(formData));
    alert("Profile updated successfully ✅");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto mt-24 px-6"
    >
      <div className="bg-white rounded-2xl shadow-md p-8">

        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <motion.img
              src={
                formData.avatar ||
                "https://api.dicebear.com/7.x/initials/svg?seed=User"
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full border object-cover"
              whileHover={{ scale: 1.05 }}
            />

            <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Save Changes
          </motion.button>

        </form>
      </div>
    </motion.div>
  );
};

export default EditProfile;
