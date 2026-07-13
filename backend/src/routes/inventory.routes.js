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

router.post(
  "/stock-in",
  verifyJWT,
  verifyAdmin,
  stockIn
);


/*
=================================
 Stock Out
=================================
*/

router.post(
  "/stock-out",
  verifyJWT,
  verifyAdmin,
  stockOut
);


/*
=================================
 Product Inventory History
=================================
*/

router.get(
  "/product/:productId",
  verifyJWT,
  verifyAdmin,
  getInventoryByProduct
);


export default router;