import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import {
  User,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const dropdownRef = useRef(null);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();

    toast.success("Logout Successfully");

    navigate("/login", {
      replace: true,
    });
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between px-6 transition-colors duration-300">

      {/* LEFT */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Stationery ERP
        </h1>

        <p className="text-sm text-gray-500 dark:text-slate-400">
          Welcome {user?.fullName || user?.name || "Admin"}
        </p>
      </div>

      {/* PROFILE */}
      <div className="relative" ref={dropdownRef}>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>

          {/* Name */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {user?.fullName || user?.name || "Admin"}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {user?.role || "User"}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">

            {/* USER INFO */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-800 dark:text-white">
                {user?.fullName || user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {user?.email || "No email"}
              </p>
            </div>

            {/* MENU */}
            <div className="p-2">

              {/* Profile */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  // navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              {/* THEME TITLE */}
              <div className="px-3 pt-3 pb-2">
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  Appearance
                </p>
              </div>

              {/* Light / Dark */}
              <div className="grid grid-cols-2 gap-2 px-2 pb-2">

                <button
                  type="button"
                  onClick={() => handleThemeChange("light")}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    theme === "light"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange("dark")}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>

              </div>

              {/* LOGOUT */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-2">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;