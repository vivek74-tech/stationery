import { Router } from "express";

/* Middlewares */
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

/* Controllers */
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = Router();

/* =========================
   CREATE PRODUCT
========================= */
router.post(
  "/",
  verifyJWT,
  verifyAdmin,
  upload.single("image"),   // ✅ FIXED (was productImage)
  createProduct
);

/* =========================
   GET ALL
========================= */
router.get("/", verifyJWT, getAllProducts);

/* =========================
   GET BY ID
========================= */
router.get("/:id", verifyJWT, getProductById);

/* =========================
   UPDATE PRODUCT
========================= */
router.patch(
  "/:id",
  verifyJWT,
  verifyAdmin,
  upload.single("image"),   // ✅ FIXED
  updateProduct
);

/* =========================
   DELETE PRODUCT
========================= */
router.delete("/:id", verifyJWT, verifyAdmin, deleteProduct);

export default router;