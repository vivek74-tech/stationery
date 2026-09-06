import { Router } from "express";

import {
  getDashboardStats,
  getMonthlySales,
  getRecentSales,
  getLowStockProducts,
} from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getDashboardStats);
router.get("/monthly-sales", getMonthlySales);
router.get("/recent-sales", getRecentSales);
router.get("/low-stock", getLowStockProducts);

export default router;