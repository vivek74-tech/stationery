
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Login from "../pages/auth/Login.jsx";
import Categories from "../pages/categories/Categories.jsx";
import Products from "../pages/products/Products.jsx";
import Suppliers from "../pages/suppliers/Suppliers.jsx";
import Inventory from "../pages/inventory/Inventory.jsx";
import Sales from "../pages/sales/Sales.jsx";
import Reports from "../pages/reports/Reports.jsx";
import Register from "../pages/auth/Register.jsx";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* ================= DASHBOARD ================= */}

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "employee"]}>
            <Dashboard />
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

    </Routes>
  );
}

export default AppRoutes;

