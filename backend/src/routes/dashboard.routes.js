import { Router } from "express";

import {
  getDashboardStats,
  getMonthlySales,
  getRecentSales,
  getLowStockProducts,
} from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// =====================================================
// DASHBOARD STATS
// =====================================================

router.get(
  "/",
  verifyJWT,
  getDashboardStats
);

// =====================================================
// MONTHLY SALES
// =====================================================

router.get(
  "/monthly-sales",
  verifyJWT,
  getMonthlySales
);

// =====================================================
// RECENT SALES
// =====================================================

router.get(
  "/recent-sales",
  verifyJWT,
  getRecentSales
);

// =====================================================
// LOW STOCK
// =====================================================

router.get(
  "/low-stock",
  verifyJWT,
  getLowStockProducts
);

export default router;