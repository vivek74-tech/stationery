import { Router } from "express";

import {
    createSale,
    getAllSales,
    getSaleById,
    getSalesSummary,
    getTopSellingProducts,
    downloadInvoice,
    deleteSale
} from "../controllers/sale.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Create Sale
router.post(
    "/",
    verifyJWT,
    verifyAdmin,
    createSale
);

// Get All Sales
router.get(
    "/",
    verifyJWT,
    verifyAdmin,
    getAllSales
);

// Dashboard Summary
router.get(
    "/summary/dashboard",
    verifyJWT,
    verifyAdmin,
    getSalesSummary
);

// Top Selling Products
router.get(
    "/analytics/top-products",
    verifyJWT,
    verifyAdmin,
    getTopSellingProducts
);

// Download Invoice
router.get(
    "/:id/invoice",
    verifyJWT,
    verifyAdmin,
    downloadInvoice
);

// Get Sale By Id
router.get(
    "/:id",
    verifyJWT,
    verifyAdmin,
    getSaleById
);

// Delete Sale
router.delete(
    "/:id",
    verifyJWT,
    verifyAdmin,
    deleteSale
);

export default router;