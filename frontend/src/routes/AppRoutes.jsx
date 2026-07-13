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

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Categories */}
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />

      {/* Products */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      {/* Suppliers */}
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        }
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />

      {/* Sales */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        }
      />

      {/* Reports */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;