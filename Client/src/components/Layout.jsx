import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 z-50">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white z-30">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="flex-1 flex flex-col mt-16 md:ml-64 overflow-y-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
