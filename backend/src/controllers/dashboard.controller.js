import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Sale } from "../models/sale.model.js";
import { Supplier } from "../models/supplier.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// =====================================================
// DASHBOARD STATS
//
// Admin:
// - Products
// - Categories
// - Suppliers
// - Users
// - Total Sales
// - Total Revenue
// - Low Stock
//
// Employee:
// - Products
// - My Sales
// - Low Stock
// =====================================================

const getDashboardStats = asyncHandler(async (req, res) => {

  // ===================================================
  // ADMIN
  // ===================================================

  if (req.user.role === "admin") {

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

      Product.countDocuments({
        stock: { $lte: 10 },
      }),

    ]);


    // ==========================
    // TOTAL REVENUE
    // ==========================

    const revenue = await Sale.aggregate([

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },

    ]);


    const totalRevenue =
      revenue[0]?.totalRevenue || 0;


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
  // EMPLOYEE
  // ===================================================

  const [
    totalProducts,
    mySales,
    lowStock,
  ] = await Promise.all([

    Product.countDocuments(),

    Sale.countDocuments({
      createdBy: req.user._id,
    }),

    Product.countDocuments({
      stock: { $lte: 10 },
    }),

  ]);


  return res.status(200).json(

    new ApiResponse(

      200,

      {
        totalProducts,

        mySales,

        lowStock,
      },

      "Employee dashboard stats fetched successfully"

    )

  );
});


// =====================================================
// MONTHLY SALES
//
// Admin:
// All sales
//
// Employee:
// Only employee's own sales
// =====================================================

const getMonthlySales = asyncHandler(async (req, res) => {

  const matchStage =
    req.user.role === "employee"
      ? {
          createdBy: req.user._id,
        }
      : {};


  const monthlySales = await Sale.aggregate([

    // ================================================
    // FILTER BY ROLE
    // ================================================

    {
      $match: matchStage,
    },


    // ================================================
    // GROUP BY MONTH + YEAR
    // ================================================

    {
      $group: {

        _id: {

          month: {
            $month: "$createdAt",
          },

          year: {
            $year: "$createdAt",
          },

        },

        totalSales: {
          $sum: "$totalAmount",
        },

      },
    },


    // ================================================
    // SORT
    // ================================================

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
//
// Admin:
// Recent sales of everyone
//
// Employee:
// Recent sales created by employee
// =====================================================

const getRecentSales = asyncHandler(async (req, res) => {

  const filter =
    req.user.role === "employee"
      ? {
          createdBy: req.user._id,
        }
      : {};


  const sales = await Sale.find(filter)

    .populate(
      "product",
      "productName sku"
    )

    .populate(
      "createdBy",
      "fullName email role"
    )

    .sort({
      createdAt: -1,
    })

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
//
// Admin + Employee
// =====================================================

const getLowStockProducts = asyncHandler(async (req, res) => {

  const products = await Product.find({

    stock: {
      $lte: 10,
    },

  })

    .populate(
      "category",
      "name"
    )

    .sort({
      stock: 1,
    });


  return res.status(200).json(

    new ApiResponse(

      200,

      products,

      "Low stock products fetched successfully"

    )

  );
});


// =====================================================
// EXPORT
// =====================================================

export {
  getDashboardStats,
  getMonthlySales,
  getRecentSales,
  getLowStockProducts,
};