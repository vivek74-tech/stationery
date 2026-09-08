import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Sale } from "../models/sale.model.js";
import { Supplier } from "../models/supplier.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// =====================================================
// DASHBOARD STATS
// =====================================================

const getDashboardStats = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user._id;

  // ===================================================
  // ADMIN STATS
  // ===================================================
  if (userRole === "admin") {
    const [
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalUsers,
      totalSales,
      lowStock,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Supplier.countDocuments(),
      User.countDocuments(),
      Sale.countDocuments(),
      Product.countDocuments({ stock: { $lte: 10 } }),
    ]);

    const revenueResult = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalProducts,
          totalCategories,
          totalSuppliers,
          totalUsers,
          totalSales,
          totalRevenue,
          lowStock,
        },
        "Admin dashboard stats fetched successfully"
      )
    );
  }

  // ===================================================
  // EMPLOYEE STATS
  // ===================================================
  const [
    totalProducts,
    totalCategories,
    totalSuppliers,
    mySales,
    lowStock,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Supplier.countDocuments(),
    Sale.countDocuments({
      createdBy: new mongoose.Types.ObjectId(userId),
    }),
    Product.countDocuments({ stock: { $lte: 10 } }),
  ]);

  // Employee Sales Revenue Calculation
  const revenueResult = await Sale.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: null,
        myRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const myRevenue = revenueResult[0]?.myRevenue || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalProducts,
        totalCategories,
        totalSuppliers,
        mySales,
        myRevenue,
        lowStock,
      },
      "Employee dashboard stats fetched successfully"
    )
  );
});

// =====================================================
// MONTHLY SALES
// =====================================================

const getMonthlySales = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user._id;

  let matchStage = {};

  if (userRole === "employee") {
    matchStage = {
      createdBy: new mongoose.Types.ObjectId(userId),
    };
  }

  // AGGREGATION PIPELINE
  const monthlySales = await Sale.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalSales: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      monthlySales,
      "Monthly sales fetched successfully"
    )
  );
});

// =====================================================
// RECENT SALES
// =====================================================

const getRecentSales = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user._id;

  let filter = {};

  if (userRole === "employee") {
    filter = {
      createdBy: new mongoose.Types.ObjectId(userId),
    };
  }

  const sales = await Sale.find(filter)
    .populate("product", "productName sku price")
    .populate("items.product", "productName sku price")
    .populate("createdBy", "fullName name email role")
    .sort({ createdAt: -1 })
    .limit(5);

  return res.status(200).json(
    new ApiResponse(
      200,
      sales,
      "Recent sales fetched successfully"
    )
  );
});

// =====================================================
// LOW STOCK PRODUCTS
// =====================================================

const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    stock: { $lte: 10 },
  })
    .populate("category", "name categoryName")
    .sort({ stock: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      products,
      "Low stock products fetched successfully"
    )
  );
});

// =====================================================
// EXPORTS
// =====================================================

export {
  getDashboardStats,
  getMonthlySales,
  getRecentSales,
  getLowStockProducts,
};