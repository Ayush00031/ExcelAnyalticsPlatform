import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/upload", label: "Upload File" },
    { path: "/charts", label: "Charts" },
    { path: "/history", label: "History" },
    { path: "/admin", label: "Admin Panel" },
  ];

  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white shadow-md z-40 transition-all duration-300 ease-in-out overflow-y-auto">
      <nav className="flex flex-col gap-4 p-6">
        {links.map(({ path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-white text-emerald-600 font-semibold"
                  : "hover:bg-emerald-700"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
