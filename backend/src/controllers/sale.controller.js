import PDFDocument from "pdfkit";

import { Sale } from "../models/sale.model.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// =====================================================
// DOWNLOAD INVOICE
// =====================================================
const downloadInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const sale = await Sale.findOne({
        _id: id,
        ...(req.user.role === "employee" ? { createdBy: req.user._id } : {}),
    }).populate("product", "productName name sku sellingPrice price");

    if (!sale) {
        throw new ApiError(404, "Sale record not found");
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=Invoice-${sale._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("Stationery Management System", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text("SALE INVOICE", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Invoice ID : ${sale._id}`);
    doc.text(`Customer   : ${sale.customerName || "Walk-in Customer"}`);
    doc.text(`Date       : ${new Date(sale.createdAt).toLocaleString("en-IN")}`);
    doc.text(`Payment    : ${sale.paymentStatus}`);

    doc.moveDown();
    // Safety check for deleted product references or naming variations
    doc.text(`Product    : ${sale.product?.productName || sale.product?.name || "Product Removed"}`);
    doc.text(`SKU        : ${sale.product?.sku || "N/A"}`);
    doc.text(`Quantity   : ${sale.quantity}`);
    doc.text(`Price      : ₹${sale.sellingPrice || sale.product?.sellingPrice || sale.product?.price || 0}`);

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount : ₹${sale.totalAmount}`);

    doc.moveDown(2);
    doc.text("Thank you for shopping with us!", { align: "center" });

    doc.end();
});

// =====================================================
// DELETE SALE
// =====================================================
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
        new ApiResponse(200, {}, "Sale deleted successfully")
    );
});

// =====================================================
// CREATE SALE (FIXED VALIDATIONS & FIELD FALLBACKS)
// =====================================================
// =====================================================
// CREATE SALE
// =====================================================
const createSale = asyncHandler(async (req, res) => {
    try {
        const {
            productId,
            product,
            items,
            quantity,
            customerName,
            paymentStatus = "PAID",
        } = req.body;

        // ---------------------------------------------
        // 1. PRODUCT ID
        // ---------------------------------------------
        const targetProductId =
            productId ||
            product ||
            items?.[0]?.product;

        if (!targetProductId) {
            throw new ApiError(
                400,
                "Product ID is required"
            );
        }

        // ---------------------------------------------
        // 2. QUANTITY
        // ---------------------------------------------
        const finalQuantity = Number(
            quantity ?? items?.[0]?.quantity
        );

        if (
            !Number.isFinite(finalQuantity) ||
            finalQuantity <= 0
        ) {
            throw new ApiError(
                400,
                "Quantity must be greater than 0"
            );
        }

        // ---------------------------------------------
        // 3. PAYMENT STATUS
        // ---------------------------------------------
        const finalPaymentStatus =
            String(paymentStatus || "PAID").toUpperCase();

        if (!["PAID", "PENDING"].includes(finalPaymentStatus)) {
            throw new ApiError(
                400,
                "Payment status must be PAID or PENDING"
            );
        }

        // ---------------------------------------------
        // 4. FIND PRODUCT
        // ---------------------------------------------
        const selectedProduct =
            await Product.findById(targetProductId);

        if (!selectedProduct) {
            throw new ApiError(
                404,
                "Product not found in database"
            );
        }

        // ---------------------------------------------
        // 5. CHECK STOCK
        // ---------------------------------------------
        const currentStock = Number(selectedProduct.stock || 0);

        if (currentStock < finalQuantity) {
            throw new ApiError(
                400,
                `Insufficient stock! Only ${currentStock} items available.`
            );
        }

        // ---------------------------------------------
        // 6. GET SELLING PRICE
        // ---------------------------------------------
        const unitPrice = Number(
            selectedProduct.sellingPrice ??
            selectedProduct.price ??
            0
        );

        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new ApiError(
                400,
                "Invalid product selling price"
            );
        }

        const totalAmount =
            unitPrice * finalQuantity;

        // ---------------------------------------------
        // 7. CREATE SALE FIRST
        // ---------------------------------------------
        const sale = await Sale.create({
            product: selectedProduct._id,
            quantity: finalQuantity,
            sellingPrice: unitPrice,
            totalAmount,
            customerName:
                customerName?.trim() ||
                "Walk-in Customer",
            paymentStatus: finalPaymentStatus,
            createdBy: req.user._id,
        });

        // ---------------------------------------------
        // 8. REDUCE STOCK
        // ---------------------------------------------
        selectedProduct.stock =
            currentStock - finalQuantity;

        await selectedProduct.save();

        // ---------------------------------------------
        // 9. INVENTORY LOG
        // ---------------------------------------------
        try {
            await Inventory.create({
                product: selectedProduct._id,
                type: "OUT",
                quantity: finalQuantity,
                note: "Sold via sales module",
                createdBy: req.user._id,
            });
        } catch (inventoryError) {
            console.error(
                "Inventory log failed:",
                inventoryError
            );
        }

        // ---------------------------------------------
        // 10. RESPONSE
        // ---------------------------------------------
        return res.status(201).json(
            new ApiResponse(
                201,
                sale,
                "Sale created successfully"
            )
        );

    } catch (error) {
        console.error(
            "CREATE SALE ERROR:",
            error
        );

        throw error;
    }
});

// =====================================================
// GET ALL SALES
// =====================================================
const getAllSales = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const filter = {
        ...(req.user.role === "employee" ? { createdBy: req.user._id } : {}),
        ...(search ? { customerName: { $regex: search, $options: "i" } } : {}),
    };

    const totalSales = await Sale.countDocuments(filter);

    const sales = await Sale.find(filter)
        .populate("product", "productName name sku sellingPrice price")
        .populate("createdBy", "fullName email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const revenue = await Sale.aggregate([
        {
            $match: req.user.role === "employee" ? { createdBy: req.user._id } : {},
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
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
                totalPages: Math.ceil(totalSales / limit) || 1,
                totalRevenue: revenue[0]?.totalRevenue || 0,
            },
            "Sales fetched successfully"
        )
    );
});

// =====================================================
// GET SALE BY ID
// =====================================================
const getSaleById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const sale = await Sale.findOne({
        _id: id,
        ...(req.user.role === "employee" ? { createdBy: req.user._id } : {}),
    })
        .populate("product", "productName name sku sellingPrice price costPrice")
        .populate("createdBy", "fullName email role");

    if (!sale) {
        throw new ApiError(404, "Sale not found");
    }

    return res.status(200).json(
        new ApiResponse(200, sale, "Sale fetched successfully")
    );
});

// =====================================================
// SALES SUMMARY
// =====================================================
const getSalesSummary = asyncHandler(async (req, res) => {
    const totalSales = await Sale.countDocuments();

    const revenueData = await Sale.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const productData = await Sale.aggregate([
        {
            $group: {
                _id: null,
                totalSold: { $sum: "$quantity" },
            },
        },
    ]);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaySales = await Sale.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const todayRevenue = await Sale.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            },
        },
        {
            $group: {
                _id: null,
                revenue: { $sum: "$totalAmount" },
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

// =====================================================
// TOP SELLING PRODUCTS
// =====================================================
const getTopSellingProducts = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 5;

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
    ]);

    const populatedData = await Sale.populate(topProducts, {
        path: "_id",
        select: "productName name sku sellingPrice price",
    });

    const result = populatedData.map((item) => ({
        product: item._id,
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue,
    }));

    return res.status(200).json(
        new ApiResponse(200, result, "Top selling products fetched successfully")
    );
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