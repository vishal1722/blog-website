import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../lib/axios.js";

export default function User() {
  const { user, isLoggedIn } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user, isLoggedIn]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ STATES ------------------ */

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-red-500 font-semibold text-lg">
            Please login first
          </p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-500 mt-2">
            This page is restricted to administrators only.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="bg-white rounded-xl border shadow-sm">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10 font-medium">{error}</p>
    );
  }

  /* ------------------ UI ------------------ */

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Users Management</h2>
          <p className="text-gray-500 mt-1">
            View and manage all registered users
          </p>
        </div>

        <span className="mt-3 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-600">
          Admin Panel
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-xl shadow-sm border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={
                      u.avtar
                        ? `http://localhost:8000${u.avtar}`
                        : "https://ui-avatars.com/api/?name=User"
                    }
                    alt={u.name}
                    className="w-10 h-10 object-cover rounded-full border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-400">
                      ID: {u._id.slice(-6)}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600">{u.email}</td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {u.role || "user"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
