import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

import { Sale } from "../models/sale.model.js";
import { Product } from "../models/product.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ==========================
   SALES REPORT
========================== */

const getSalesReport = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const filter = {};

  if (search) {
    filter.customerName = {
      $regex: search,
      $options: "i",
    };
  }

  const totalSales = await Sale.countDocuments(filter);

  const sales = await Sale.find(filter)
    .populate("product")
    .populate("createdBy", "fullName")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sales,
        page,
        limit,
        totalSales,
        totalPages: Math.ceil(totalSales / limit),
      },
      "Sales report fetched successfully"
    )
  );
});

/* ==========================
   INVENTORY REPORT
========================== */

const getInventoryReport = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const filter = {};

  if (search) {
    filter.$or = [
      {
        productName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        sku: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category", "categoryName")
    .populate("supplier", "supplierName")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        page,
        limit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
      },
      "Inventory report fetched successfully"
    )
  );
});

/* ==========================
   SALES EXCEL
========================== */

const generateSalesExcel = asyncHandler(async (req, res) => {
  const sales = await Sale.find()
    .populate("product")
    .populate("createdBy", "fullName");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sales Report");

  sheet.columns = [
    { header: "Product", key: "product", width: 25 },
    { header: "SKU", key: "sku", width: 20 },
    { header: "Quantity", key: "qty", width: 12 },
    { header: "Price", key: "price", width: 15 },
    { header: "Total", key: "total", width: 15 },
    { header: "Created By", key: "user", width: 20 },
  ];

  sales.forEach((sale) => {
    sheet.addRow({
      product: sale.product?.productName || "",
      sku: sale.product?.sku || "",
      qty: sale.quantity,
      price: sale.sellingPrice,
      total: sale.totalAmount,
      user: sale.createdBy?.fullName || "",
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=sales-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});


/* ==========================
   PRODUCTS EXCEL
========================== */

const exportProductsExcel = asyncHandler(async (req, res) => {

  const products = await Product.find()
    .populate("category", "name")
    .populate("supplier", "supplierName");

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Products");

  sheet.columns = [
    { header: "Product", key: "productName", width: 30 },
    { header: "SKU", key: "sku", width: 20 },
    { header: "Category", key: "category", width: 20 },
    { header: "Supplier", key: "supplier", width: 25 },
    { header: "Cost Price", key: "costPrice", width: 15 },
    { header: "Selling Price", key: "sellingPrice", width: 15 },
    { header: "Stock", key: "stock", width: 10 },
  ];

  products.forEach((product) => {

    sheet.addRow({
      productName: product.productName,
      sku: product.sku,
      category: product.category?.name || "",
      supplier: product.supplier?.supplierName || "",
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
    });

  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=products.xlsx"
  );

  await workbook.xlsx.write(res);

  res.end();

});


/* ==========================
   INVENTORY EXCEL
========================== */

const generateInventoryExcel = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category", "categoryName")
    .populate("supplier", "supplierName");

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Inventory Report");

  sheet.columns = [
    { header: "Product", key: "productName", width: 30 },
    { header: "SKU", key: "sku", width: 20 },
    { header: "Category", key: "category", width: 25 },
    { header: "Supplier", key: "supplier", width: 25 },
    { header: "Cost Price", key: "costPrice", width: 15 },
    { header: "Selling Price", key: "sellingPrice", width: 15 },
    { header: "Stock", key: "stock", width: 12 },
  ];

  products.forEach((product) => {
    sheet.addRow({
      productName: product.productName,
      sku: product.sku,
      category: product.category?.categoryName || "",
      supplier: product.supplier?.supplierName || "",
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=inventory-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});

/* ==========================
   INVOICE PDF
========================== */

const generateInvoicePDF = asyncHandler(async (req, res) => {
  const { saleId } = req.params;

  const sale = await Sale.findById(saleId)
    .populate("product")
    .populate("createdBy", "fullName email");

  if (!sale) {
    return res.status(404).json(
      new ApiResponse(404, null, "Sale not found")
    );
  }

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${sale._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(22).text("Stationery ERP Invoice", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(14).text(`Invoice ID : ${sale._id}`);
  doc.text(`Customer : ${sale.customerName || "Walk-in Customer"}`);
  doc.text(`Product : ${sale.product?.productName || ""}`);
  doc.text(`SKU : ${sale.product?.sku || ""}`);
  doc.text(`Quantity : ${sale.quantity}`);
  doc.text(`Price : ₹${sale.sellingPrice}`);
  doc.text(`Total : ₹${sale.totalAmount}`);

  doc.moveDown();

  doc.text(`Generated By : ${sale.createdBy?.fullName}`);

  doc.end();
});

export {
  getSalesReport,
  getInventoryReport,
  generateSalesExcel,
  generateInventoryExcel,
  generateInvoicePDF,
  exportProductsExcel,
};