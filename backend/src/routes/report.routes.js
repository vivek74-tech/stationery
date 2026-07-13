import { Router } from "express";
import {
  getSalesReport,
  getInventoryReport,
  generateSalesExcel,
  generateInventoryExcel,
  generateInvoicePDF,
  exportProductsExcel,
} from "../controllers/report.controller.js";

const router = Router();

router.get("/sales", getSalesReport);

router.get("/inventory", getInventoryReport);

router.get("/sales-excel", generateSalesExcel);

router.get("/products-excel", exportProductsExcel);

router.get("/inventory-excel", generateInventoryExcel);

router.get("/invoice/:saleId", generateInvoicePDF);

export default router;