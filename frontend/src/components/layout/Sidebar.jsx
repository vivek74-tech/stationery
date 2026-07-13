import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const { pathname } = useLocation();

  const menus = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Categories",
      path: "/categories",
    },
    {
      name: "Suppliers",
      path: "/suppliers",
    },
    {
      name: "Inventory",
      path: "/inventory",
    },
    {
      name: "Sales",
      path: "/sales",
    },
    {
      name: "Reports",
      path: "/reports",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-800 text-white shadow-lg">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-wide">
          Stationery ERP
        </h1>
      </div>

      <nav className="mt-4">

        {menus.map((menu) => {
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