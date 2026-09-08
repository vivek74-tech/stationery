import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

// =====================================================
// AUTH
// =====================================================

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// =====================================================
// DASHBOARDS
// =====================================================

import Dashboard from "../pages/dashboard/Dashboard.jsx";
import EmployeeDashboard from "../pages/dashboard/EmployeeDashboard.jsx";

// =====================================================
// PAGES
// =====================================================

import Categories from "../pages/categories/Categories.jsx";
import Products from "../pages/products/Products.jsx";
import Suppliers from "../pages/suppliers/Suppliers.jsx";
import Inventory from "../pages/inventory/Inventory.jsx";
import Sales from "../pages/sales/Sales.jsx";
import Reports from "../pages/reports/Reports.jsx";

function AppRoutes() {
  const { user } = useAuth();

  // Normalize role
  const role = user?.role?.toLowerCase()?.trim();

  console.log("========== ROUTE DEBUG ==========");
  console.log("USER:", user);
  console.log("USER ROLE:", user?.role);
  console.log("NORMALIZED ROLE:", role);
  console.log("=================================");

  // =====================================================
  // DASHBOARD COMPONENT
  // =====================================================

  const DashboardByRole = () => {
    if (role === "admin") {
      return <Dashboard />;
    }

    if (role === "employee") {
      return <EmployeeDashboard />;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">
            Invalid User Role
          </h2>

          <p className="text-slate-500 mt-2">
            Current role: {user?.role || "undefined"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={["admin", "employee"]}
          >
            <DashboardByRole />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          EXPLICIT ADMIN DASHBOARD
      ===================================================== */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          EXPLICIT EMPLOYEE DASHBOARD
      ===================================================== */}

      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <Route
        path="/products"
        element={
          <ProtectedRoute
            allowedRoles={["admin", "employee"]}
          >
            <Products />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Categories />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          SUPPLIERS
      ===================================================== */}

      <Route
        path="/suppliers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suppliers />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          INVENTORY
      ===================================================== */}

      <Route
        path="/inventory"
        element={
          <ProtectedRoute
            allowedRoles={["admin", "employee"]}
          >
            <Inventory />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          SALES
      ===================================================== */}

      <Route
        path="/sales"
        element={
          <ProtectedRoute
            allowedRoles={["admin", "employee"]}
          >
            <Sales />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          REPORTS
      ===================================================== */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          FALLBACK
      ===================================================== */}

      <Route
        path="*"
        element={
          <ProtectedRoute
            allowedRoles={["admin", "employee"]}
          >
            <DashboardByRole />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;