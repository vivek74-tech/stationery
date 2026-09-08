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
  Menu,
  X,
  User,
} from "lucide-react";

function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  const filteredMenus = menus.filter((menu) =>
    menu.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 left-0 right-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-base tracking-wide">Stationery ERP</span>
        </div>

        <div className="text-xs bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-full font-semibold capitalize border border-blue-500/30">
          {user?.role || "user"}
        </div>
      </div>

      {/* Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-slate-900 text-white shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800
          ${
            isMobileOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between min-h-[65px]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-md shrink-0">
                S
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <h1 className="text-base font-bold tracking-wide text-white truncate">
                  Stationery ERP
                </h1>
              )}
            </div>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Section */}
          <div className="px-4 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                <User className="w-5 h-5" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-400 font-medium">Welcome,</p>
                  <p className="font-semibold text-sm text-slate-100 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-blue-400 font-semibold capitalize">
                    {user?.role || "Role"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 mt-2">
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
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
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