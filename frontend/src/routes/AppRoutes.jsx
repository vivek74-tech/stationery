import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

// Auth
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// Dashboards
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import EmployeeDashboard from "../pages/dashboard/EmployeeDashboard.jsx";

// Pages
import Categories from "../pages/categories/Categories.jsx";
import Products from "../pages/products/Products.jsx";
import Suppliers from "../pages/suppliers/Suppliers.jsx";
import Inventory from "../pages/inventory/Inventory.jsx";
import Sales from "../pages/sales/Sales.jsx";
import Reports from "../pages/reports/Reports.jsx";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ================= DASHBOARD ================= */}

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee"]}>
            {user?.role === "admin" ? (
              <Dashboard />
            ) : (
              <EmployeeDashboard />
            )}
          </ProtectedRoute>
        }
      />


      {/* ================= PRODUCTS ================= */}

      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee"]}>
            <Products />
          </ProtectedRoute>
        }
      />


      {/* ================= CATEGORIES ================= */}

      <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Categories />
          </ProtectedRoute>
        }
      />


      {/* ================= SUPPLIERS ================= */}

      <Route
        path="/suppliers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suppliers />
          </ProtectedRoute>
        }
      />


      {/* ================= INVENTORY ================= */}

      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee"]}>
            <Inventory />
          </ProtectedRoute>
        }
      />


      {/* ================= SALES ================= */}

      <Route
        path="/sales"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee"]}>
            <Sales />
          </ProtectedRoute>
        }
      />


      {/* ================= REPORTS ================= */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        }
      />


      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee"]}>
            {user?.role === "admin" ? (
              <Dashboard />
            ) : (
              <EmployeeDashboard />
            )}
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;