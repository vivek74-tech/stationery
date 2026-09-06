import { Router } from "express";

import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ================= CREATE SUPPLIER =================
// Admin only
router.post(
  "/",
  verifyJWT,
  verifyAdmin,
  createSupplier
);

// ================= GET ALL SUPPLIERS =================
// Admin only
router.get(
  "/",
  verifyJWT,
  verifyAdmin,
  getAllSuppliers
);

// ================= GET SUPPLIER BY ID =================
// Admin only
router.get(
  "/:id",
  verifyJWT,
  verifyAdmin,
  getSupplierById
);

// ================= UPDATE SUPPLIER =================
// Admin only
router.patch(
  "/:id",
  verifyJWT,
  verifyAdmin,
  updateSupplier
);

// ================= DELETE SUPPLIER =================
// Admin only
router.delete(
  "/:id",
  verifyJWT,
  verifyAdmin,
  deleteSupplier
);

export default router;