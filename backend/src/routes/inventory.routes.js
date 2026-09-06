import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

import {
  stockIn,
  stockOut,
  getInventoryHistory,
  getInventoryByProduct,
} from "../controllers/inventory.controller.js";

const router = Router();

/*
=================================
 Inventory History
=================================
*/

// Admin + Employee
router.get(
  "/history",
  verifyJWT,
  getInventoryHistory
);


/*
=================================
 Stock In
=================================
*/

// Admin + Employee
router.post(
  "/stock-in",
  verifyJWT,
  stockIn
);


/*
=================================
 Stock Out
=================================
*/

// Admin + Employee
router.post(
  "/stock-out",
  verifyJWT,
  stockOut
);


/*
=================================
 Product Inventory History
=================================
*/

// Admin + Employee
router.get(
  "/product/:productId",
  verifyJWT,
  getInventoryByProduct
);

export default router;