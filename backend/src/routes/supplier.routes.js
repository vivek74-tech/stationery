import { Router } from "express";
import {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} from "../controllers/supplier.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/", verifyJWT, verifyAdmin, createSupplier);

router.get("/", verifyJWT, getAllSuppliers);

router.get("/:id", verifyJWT, getSupplierById);

router.patch("/:id", verifyJWT, verifyAdmin, updateSupplier);

router.delete("/:id", verifyJWT, verifyAdmin, deleteSupplier);

export default router;