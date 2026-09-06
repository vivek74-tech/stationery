
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      roles: ["admin", "employee"],
    },
    {
      name: "Products",
      path: "/products",
      roles: ["admin", "employee"],
    },
    {
      name: "Categories",
      path: "/categories",
      roles: ["admin"],
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      roles: ["admin"],
    },
    {
      name: "Inventory",
      path: "/inventory",
      roles: ["admin", "employee"],
    },
    {
      name: "Sales",
      path: "/sales",
      roles: ["admin","employee"],
    },
    {
      name: "Reports",
      path: "/reports",
      roles: ["admin"],
    },
  ];

  // User ke role ke according menus filter honge
  const filteredMenus = menus.filter((menu) =>
    menu.roles.includes(user?.role)
  );

  return (
    <aside className="w-64 min-h-screen bg-slate-800 text-white shadow-lg">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-wide">
          Stationery ERP
        </h1>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-slate-700">
        <p className="text-sm text-slate-300">
          Welcome
        </p>

        <p className="font-semibold">
          {user?.name}
        </p>

        <p className="text-sm text-blue-400 capitalize">
          {user?.role}
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-4">

        {filteredMenus.map((menu) => {

          const isActive =
            menu.path === "/"
              ? pathname === "/"
              : pathname.startsWith(menu.path);

          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`block px-6 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-slate-700 border-r-4 border-blue-500 font-semibold"
                  : "hover:bg-slate-700"
              }`}
            >
              {menu.name}
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}

export default Sidebar;

