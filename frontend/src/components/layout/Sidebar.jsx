import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  Boxes,
  ShoppingCart,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Menu, // 3 lines icon
  X,
  User,
} from "lucide-react";

function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Controls for Sidebar expansion & Sheet Overlay
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile drawer open

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      roles: ["admin", "employee"],
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/products",
      roles: ["admin", "employee"],
      icon: Package,
    },
    {
      name: "Categories",
      path: "/categories",
      roles: ["admin"],
      icon: FolderTree,
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      roles: ["admin"],
      icon: Truck,
    },
    {
      name: "Inventory",
      path: "/inventory",
      roles: ["admin", "employee"],
      icon: Boxes,
    },
    {
      name: "Sales",
      path: "/sales",
      roles: ["admin", "employee"],
      icon: ShoppingCart,
    },
    {
      name: "Reports",
      path: "/reports",
      roles: ["admin"],
      icon: BarChart3,
    },
  ];

  // Role based filtering
  const filteredMenus = menus.filter((menu) =>
    menu.roles.includes(user?.role)
  );

  return (
    <>
      {/* ---------------- 1. THREE LINES (HAMBURGER) BUTTON FOR MOBILE ---------------- */}
      <div className="lg:hidden fixed top-3 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center"
          title="Toggle Menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ---------------- 2. BACKDROP OVERLAY ---------------- */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ---------------- 3. SIDEBAR / SHEET ---------------- */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-slate-900 text-white shadow-xl z-50 flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-slate-800
          ${
            // Mobile Sheet Slide state
            isMobileOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full lg:translate-x-0"
          }
          ${
            // Desktop Collapse width
            isCollapsed ? "lg:w-20" : "lg:w-64"
          }
        `}
      >
        <div>
          {/* Header & Logo */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between min-h-[73px]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                S
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <h1 className="text-lg font-bold tracking-wide text-white truncate">
                  Stationery ERP
                </h1>
              )}
            </div>

            {/* Close button on mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Section */}
          <div className="px-4 py-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/40">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                <User className="w-5 h-5" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-400 font-medium">Welcome,</p>
                  <p className="font-semibold text-sm text-slate-100 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-blue-400 font-semibold capitalize tracking-wide">
                    {user?.role || "Role"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {filteredMenus.map((menu) => {
              const Icon = menu.icon;

              const isActive =
                menu.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(menu.path);

              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-blue-400"
                    }`}
                  />

                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate">{menu.name}</span>
                  )}

                  {/* Desktop Hover Tooltip when Collapsed */}
                  {isCollapsed && !isMobileOpen && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap border border-slate-700">
                      {menu.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Collapse / Expand Button */}
        <div className="p-3 border-t border-slate-800 hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded-xl transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Menu</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;