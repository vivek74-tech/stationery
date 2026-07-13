import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Sale } from "../models/sale.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Supplier } from "../models/supplier.model.js";
const getDashboardStats = asyncHandler(async (req, res) => {

  const [
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalUsers,
    totalSales,
    lowStock
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Supplier.countDocuments(),
    User.countDocuments(),
    Sale.countDocuments(),
    Product.countDocuments({
      stock: { $lte: 10 }
    })
  ]);

  const revenue = await Sale.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalAmount"
        }
      }
    }
  ]);

  const totalRevenue =
    revenue.length > 0
      ? revenue[0].totalRevenue
      : 0;

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
        lowStock
      },
      "Dashboard stats fetched successfully"
    )
  );

});





// const getMonthlySales = asyncHandler(async (req, res) => {
//   const monthlySales = await Sale.aggregate([
//     {
//       $group: {
//         _id: {
//           month: { $month: "$createdAt" },
//           year: { $year: "$createdAt" }
//         },
//         totalSales: { $sum: "$totalAmount" }
//       }
//     },
//     {
//       $sort: {
//         "_id.year": 1,
//         "_id.month": 1
//       }
//     }
//   ]);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       monthlySales,
//       "Monthly sales fetched successfully"
//     )
//   );
// });

// const getRecentSales = asyncHandler(async (req, res) => {

//   const sales = await Sale.find()
//     .populate("product", "productName sku")
//     .populate("createdBy", "fullName email")
//     .sort({ createdAt: -1 })
//     .limit(5);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       sales,
//       "Recent sales fetched successfully"
//     )
//   );

// });


/* =====================================
   Monthly Sales
===================================== */

const getMonthlySales = asyncHandler(async (req, res) => {
  const monthlySales = await Sale.aggregate([
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


const getRecentSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find()
    .populate("product", "productName sku")
    .populate("createdBy", "fullName email")
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

/* =====================================
   Low Stock Products
===================================== */




const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    stock: {
      $lte: 10,
    },
  })
    .populate("category", "name")
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


export {
  getRecentSales,
  getDashboardStats,
  getMonthlySales,
  getLowStockProducts

};

