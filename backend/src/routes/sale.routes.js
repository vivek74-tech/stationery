import { Router } from "express";

import {
  createSale,
  getAllSales,
  getSaleById,
  getSalesSummary,
  getTopSellingProducts,
  downloadInvoice,
  deleteSale,
} from "../controllers/sale.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ================= CREATE SALE =================
// Admin + Employee
router.post(
  "/",
  verifyJWT,
  createSale
);

// ================= GET ALL SALES =================
// Admin + Employee
router.get(
  "/",
  verifyJWT,
  getAllSales
);

// ================= DASHBOARD SUMMARY =================
// Admin only
router.get(
  "/summary/dashboard",
  verifyJWT,
  verifyAdmin,
  getSalesSummary
);

// ================= TOP SELLING PRODUCTS =================
// Admin only
router.get(
  "/analytics/top-products",
  verifyJWT,
  verifyAdmin,
  getTopSellingProducts
);

// ================= DOWNLOAD INVOICE =================
// Admin + Employee
router.get(
  "/:id/invoice",
  verifyJWT,
  downloadInvoice
);

// ================= GET SALE BY ID =================
// Admin + Employee
router.get(
  "/:id",
  verifyJWT,
  getSaleById
);

// ================= DELETE SALE =================
// Admin only
router.delete(
  "/:id",
  verifyJWT,
  verifyAdmin,
  deleteSale
);

export default router;