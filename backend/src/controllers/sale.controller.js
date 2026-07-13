import PDFDocument from "pdfkit";

import { Sale } from "../models/sale.model.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const downloadInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const sale = await Sale.findById(id)
        .populate("product", "productName sku sellingPrice");

    if (!sale) {
        throw new ApiError(404, "Sale not found");
    }

    const doc = new PDFDocument({
        margin: 40,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=Invoice-${sale._id}.pdf`
    );

    doc.pipe(res);

    doc
        .fontSize(22)
        .text("Stationery Management System", {
            align: "center",
        });

    doc.moveDown();

    doc
        .fontSize(18)
        .text("SALE INVOICE", {
            align: "center",
        });

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(`Invoice ID : ${sale._id}`);
    doc.text(`Customer   : ${sale.customerName}`);
    doc.text(`Date       : ${sale.createdAt.toLocaleString()}`);
    doc.text(`Payment    : ${sale.paymentStatus}`);

    doc.moveDown();

    doc.text(`Product    : ${sale.product.productName}`);
    doc.text(`SKU        : ${sale.product.sku}`);
    doc.text(`Quantity   : ${sale.quantity}`);
    doc.text(`Price      : ₹${sale.sellingPrice}`);

    doc.moveDown();

    doc
        .fontSize(14)
        .text(`Total Amount : ₹${sale.totalAmount}`);

    doc.moveDown(2);

    doc.text(
        "Thank you for shopping with us!",
        {
            align: "center",
        }
    );

    doc.end();
});

const deleteSale = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const sale = await Sale.findById(id);

    if (!sale) {
        throw new ApiError(404, "Sale not found");
    }

    const product = await Product.findById(sale.product);

    if (product) {
        product.stock += sale.quantity;
        await product.save();
    }

    await Inventory.deleteMany({
        product: sale.product,
        quantity: sale.quantity,
        type: "OUT",
    });

    await Sale.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Sale deleted successfully"
        )
    );
});

const createSale = asyncHandler(async (req, res) => {
    let {
        productId,
        quantity,
        customerName,
        paymentStatus = "PAID"
    } = req.body;

    quantity = Number(quantity);

    if (!productId || !quantity || quantity <= 0) {
        throw new ApiError(400, "Product ID and valid quantity are required");
    }

    paymentStatus = paymentStatus.toUpperCase();

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, "Insufficient stock");
    }

    const totalAmount = product.sellingPrice * quantity;

    product.stock -= quantity;
    await product.save();

    const sale = await Sale.create({
        product: productId,
        quantity,
        sellingPrice: product.sellingPrice,
        totalAmount,
        customerName: customerName || "Walk-in Customer",
        paymentStatus,
        createdBy: req.user._id
    });

    await Inventory.create({
        product: productId,
        type: "OUT",
        quantity,
        note: "Sold via sales module",
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            sale,
            "Sale created successfully"
        )
    );
});

const getAllSales = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const filter = search
        ? {
              customerName: {
                  $regex: search,
                  $options: "i",
              },
          }
        : {};

    const totalSales = await Sale.countDocuments(filter);

    const sales = await Sale.find(filter)
        .populate("product", "productName sku sellingPrice")
        .populate("createdBy", "fullName email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

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

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                sales,
                page,
                limit,
                totalSales,
                totalPages: Math.ceil(totalSales / limit),
                totalRevenue: revenue[0]?.totalRevenue || 0,
            },
            "Sales fetched successfully"
        )
    );
});

const getSaleById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const sale = await Sale.findById(id)
        .populate("product", "productName sku sellingPrice costPrice")
        .populate("createdBy", "fullName email role");

    if (!sale) {
        throw new ApiError(404, "Sale not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            sale,
            "Sale fetched successfully"
        )
    );
});

const getSalesSummary = asyncHandler(async (req, res) => {

    const totalSales = await Sale.countDocuments();

    const revenueData = await Sale.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$totalAmount",
                },
            },
        },
    ]);

    const productData = await Sale.aggregate([
        {
            $group: {
                _id: null,
                totalSold: {
                    $sum: "$quantity",
                },
            },
        },
    ]);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaySales = await Sale.countDocuments({
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
    });

    const todayRevenue = await Sale.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            },
        },
        {
            $group: {
                _id: null,
                revenue: {
                    $sum: "$totalAmount",
                },
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalSales,
                totalRevenue: revenueData[0]?.totalRevenue || 0,
                totalProductsSold: productData[0]?.totalSold || 0,
                todaySales,
                todayRevenue: todayRevenue[0]?.revenue || 0,
            },
            "Sales summary fetched successfully"
        )
    );
});

const getTopSellingProducts = asyncHandler(async (req, res) => {

    const limit = Number(req.query.limit) || 5;

    const topProducts = await Sale.aggregate([
        {
            $group: {
                _id: "$product",
                totalSold: {
                    $sum: "$quantity",
                },
                totalRevenue: {
                    $sum: "$totalAmount",
                },
            },
        },
        {
            $sort: {
                totalSold: -1,
            },
        },
        {
            $limit: limit,
        },
    ]);

    const populatedData = await Sale.populate(topProducts, {
        path: "_id",
        select: "productName sku sellingPrice",
    });

    const result = populatedData.map((item) => ({
        product: item._id,
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue,
    }));

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Top selling products fetched successfully"
        )
    );
});



export {
    createSale,
    getAllSales,
    getSaleById,
    getSalesSummary,
    getTopSellingProducts,
    downloadInvoice,
    deleteSale
};