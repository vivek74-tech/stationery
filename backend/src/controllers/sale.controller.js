import PDFDocument from "pdfkit";
import mongoose from "mongoose";
import { Sale } from "../models/sale.model.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// CREATE SALE WITH TRANSACTION
const createSale = asyncHandler(async (req, res) => {
  const { productId, product, items, quantity, customerName, paymentStatus = "PAID" } = req.body;

  const targetProductId = productId || product || items?.[0]?.product;
  if (!targetProductId) {
    throw new ApiError(400, "Product ID is required");
  }

  const finalQuantity = Number(quantity ?? items?.[0]?.quantity);
  if (!Number.isFinite(finalQuantity) || finalQuantity <= 0) {
    throw new ApiError(400, "Valid quantity greater than 0 is required");
  }

  const finalPaymentStatus = String(paymentStatus || "PAID").toUpperCase();
  if (!["PAID", "PENDING"].includes(finalPaymentStatus)) {
    throw new ApiError(400, "Payment status must be PAID or PENDING");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const selectedProduct = await Product.findById(targetProductId).session(session);
    if (!selectedProduct) {
      throw new ApiError(404, "Product not found");
    }

    if (selectedProduct.stock < finalQuantity) {
      throw new ApiError(400, `Insufficient stock! Only ${selectedProduct.stock} items available.`);
    }

    const unitPrice = Number(selectedProduct.sellingPrice ?? 0);
    const totalAmount = unitPrice * finalQuantity;

    const [sale] = await Sale.create(
      [
        {
          product: selectedProduct._id,
          quantity: finalQuantity,
          sellingPrice: unitPrice,
          totalAmount,
          customerName: customerName?.trim() || "Walk-in Customer",
          paymentStatus: finalPaymentStatus,
          createdBy: req.user._id,
        },
      ],
      { session }
    );

    selectedProduct.stock -= finalQuantity;
    await selectedProduct.save({ session });

    await Inventory.create(
      [
        {
          product: selectedProduct._id,
          type: "OUT",
          quantity: finalQuantity,
          note: `Sold via sales module (Sale ID: ${sale._id})`,
          createdBy: req.user._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(new ApiResponse(201, sale, "Sale created successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// DOWNLOAD INVOICE
const downloadInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sale = await Sale.findOne({
    _id: id,
    ...(req.user.role === "employee" ? { createdBy: req.user._id } : {}),
  }).populate("product", "productName sku sellingPrice");

  if (!sale) {
    throw new ApiError(404, "Sale record not found");
  }

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=Invoice-${sale._id}.pdf`);

  doc.pipe(res);

  doc.fontSize(20).text("STATIONERY STORE INVOICE", { align: "center" }).moveDown();
  doc.fontSize(10).text(`Invoice Ref : ${sale._id}`);
  doc.text(`Customer    : ${sale.customerName}`);
  doc.text(`Date        : ${new Date(sale.createdAt).toLocaleString("en-IN")}`);
  doc.text(`Status      : ${sale.paymentStatus}`);
  doc.moveDown();

  doc.text(`Product     : ${sale.product?.productName || "N/A"}`);
  doc.text(`SKU         : ${sale.product?.sku || "N/A"}`);
  doc.text(`Quantity    : ${sale.quantity}`);
  doc.text(`Unit Price  : INR ${sale.sellingPrice}`);
  doc.moveDown();

  doc.fontSize(14).text(`Total Amount : INR ${sale.totalAmount}`, { underline: true });
  doc.moveDown(2);
  doc.fontSize(10).text("Thank you for your business!", { align: "center" });

  doc.end();
});

// DELETE SALE WITH TRANSACTION
const deleteSale = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sale = await Sale.findById(id).session(session);
    if (!sale) {
      throw new ApiError(404, "Sale record not found");
    }

    const product = await Product.findById(sale.product).session(session);
    if (product) {
      product.stock += sale.quantity;
      await product.save({ session });
    }

    await Inventory.create(
      [
        {
          product: sale.product,
          type: "IN",
          quantity: sale.quantity,
          note: `Reverted from deleted sale (Sale ID: ${sale._id})`,
          createdBy: req.user._id,
        },
      ],
      { session }
    );

    await Sale.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(new ApiResponse(200, {}, "Sale reverted and deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// GET ALL SALES
const getAllSales = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const search = req.query.search || "";
  const skip = (page - 1) * limit;

  const filter = {
    ...(req.user.role === "employee" ? { createdBy: req.user._id } : {}),
    ...(search ? { customerName: { $regex: search, $options: "i" } } : {}),
  };

  const totalSales = await Sale.countDocuments(filter);

  const sales = await Sale.find(filter)
    .populate("product", "productName sku sellingPrice")
    .populate("createdBy", "fullName email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const aggregateMatch = req.user.role === "employee"
    ? { createdBy: new mongoose.Types.ObjectId(req.user._id) }
    : {};

  const revenue = await Sale.aggregate([
    { $match: aggregateMatch },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sales,
        page,
        limit,
        totalSales,
        totalPages: Math.ceil(totalSales / limit) || 1,
        totalRevenue: revenue[0]?.totalRevenue || 0,
      },
      "Sales fetched successfully"
    )
  );
});

// GET SALE BY ID
const getSaleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sale = await Sale.findOne({
    _id: id,
    ...(req.user.role === "employee" ? { createdBy: req.user._id } : {}),
  })
    .populate("product", "productName sku sellingPrice costPrice")
    .populate("createdBy", "fullName email role");

  if (!sale) {
    throw new ApiError(404, "Sale record not found");
  }

  return res.status(200).json(new ApiResponse(200, sale, "Sale fetched successfully"));
});

// GET SALES SUMMARY
const getSalesSummary = asyncHandler(async (req, res) => {
  const totalSales = await Sale.countDocuments();

  const aggregateTotals = await Sale.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalSold: { $sum: "$quantity" },
      },
    },
  ]);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todayMetrics = await Sale.aggregate([
    { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
    {
      $group: {
        _id: null,
        todaySalesCount: { $sum: 1 },
        todayRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSales,
        totalRevenue: aggregateTotals[0]?.totalRevenue || 0,
        totalProductsSold: aggregateTotals[0]?.totalSold || 0,
        todaySales: todayMetrics[0]?.todaySalesCount || 0,
        todayRevenue: todayMetrics[0]?.todayRevenue || 0,
      },
      "Sales summary fetched successfully"
    )
  );
});

// GET TOP SELLING PRODUCTS
const getTopSellingProducts = asyncHandler(async (req, res) => {
  const limit = Math.max(1, Number(req.query.limit) || 5);

  const topProducts = await Sale.aggregate([
    {
      $group: {
        _id: "$product",
        totalSold: { $sum: "$quantity" },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        _id: 0,
        product: "$productDetails",
        totalSold: 1,
        totalRevenue: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, topProducts, "Top selling products fetched successfully"));
});

export {
  createSale,
  getAllSales,
  getSaleById,
  getSalesSummary,
  getTopSellingProducts,
  downloadInvoice,
  deleteSale,
};