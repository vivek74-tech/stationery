import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, verifyAdmin, createCategory);

router.get("/", verifyJWT, getAllCategories);

router.get("/:id", verifyJWT, getCategoryById);

router.patch("/:id", verifyJWT, verifyAdmin, updateCategory);

router.delete("/:id", verifyJWT, verifyAdmin, deleteCategory);

export default router;