import { Router } from "express";

import {
  getDashboardStats,
  getMonthlySales,
  getRecentSales,
  getLowStockProducts
} from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

// Dashboard Stats
router.get("/", getDashboardStats);

// Monthly Sales
router.get("/monthly-sales", getMonthlySales);

// Recent Sales
router.get("/recent-sales", getRecentSales);

// Low Stock Products
router.get("/low-stock", getLowStockProducts);

export default router;