import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Topbar from "@/components/Topbar";
import AppSidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      <Topbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main
        className="
          flex-1
          pt-20
          px-4
          sm:px-6
          lg:px-8
          lg:ml-72
          pb-20
        "
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t lg:ml-72">
        <Footer />
      </footer>
    </div>
  );
}
