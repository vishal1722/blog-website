import AppSidebar from "@/components/AppSidebar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <SidebarProvider>

      {/* TOPBAR FIXED */}
      <Topbar />

      {/* SIDEBAR */}
      <AppSidebar />

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 ml-0 lg:ml-64 transition-all">

        <div className="min-h-[calc(100vh-45px)] ">
          <Outlet />
        </div>

        <Footer />
      </main>

    </SidebarProvider>
  );
};

export default Layout;
