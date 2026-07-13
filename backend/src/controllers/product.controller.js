import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Sale } from "../models/sale.model.js";
import { Supplier } from "../models/supplier.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {
    const {
        productName,
        description,
        category,
        supplier,
        sku,
        costPrice,
        sellingPrice,
        stock
    } = req.body;

    if (
        !productName ||
        !category ||
        !supplier ||
        !sku ||
        costPrice == null ||
        sellingPrice == null
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    const existedCategory = await Category.findById(category);

    if (!existedCategory) {
        throw new ApiError(404, "Category not found");
    }

    const existedSupplier = await Supplier.findById(supplier);

    if (!existedSupplier) {
        throw new ApiError(404, "Supplier not found");
    }

    const existedProduct = await Product.findOne({ sku });

    if (existedProduct) {
        throw new ApiError(409, "SKU already exists");
    }

    let productImage = "";

    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);

        if (uploadedImage) {
            productImage = uploadedImage.secure_url;
        }
    }

    const product = await Product.create({
        productName,
        description,
        category,
        supplier,
        sku,
        costPrice,
        sellingPrice,
        stock,
        productImage,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            product,
            "Product created successfully"
        )
    );
});

// const getAllProducts = asyncHandler(async (req, res) => {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 5;
//     const search = req.query.search || "";

//     const skip = (page - 1) * limit;

//     const filter = search
//         ? {
//               $or: [
//                   {
//                       productName: {
//                           $regex: search,
//                           $options: "i"
//                       }
//                   },
//                   {
//                       sku: {
//                           $regex: search,
//                           $options: "i"
//                       }
//                   }
//               ]
//           }
//         : {};

//     const totalProducts = await Product.countDocuments(filter);

//     const products = await Product.find(filter)
//         .populate("category", "name")
//         .populate("supplier", "supplierName companyName")
//         .populate("createdBy", "fullName email role")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             {
//                 products,
//                 page,
//                 limit,
//                 totalProducts,
//                 totalPages: Math.ceil(totalProducts / limit)
//             },
//             "Products fetched successfully"
//         )
//     );
// });

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate("category", "name")
        .populate("supplier", "supplierName companyName")
        .populate("createdBy", "fullName email role");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product fetched successfully"
        )
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        productName,
        description,
        category,
        supplier,
        sku,
        costPrice,
        sellingPrice,
        stock
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (category) {
        const existedCategory = await Category.findById(category);

        if (!existedCategory) {
            throw new ApiError(404, "Category not found");
        }

        product.category = category;
    }

    if (supplier) {
        const existedSupplier = await Supplier.findById(supplier);

        if (!existedSupplier) {
            throw new ApiError(404, "Supplier not found");
        }

        product.supplier = supplier;
    }

    if (sku && sku !== product.sku) {
        const existedSku = await Product.findOne({ sku });

        if (existedSku) {
            throw new ApiError(409, "SKU already exists");
        }

        product.sku = sku;
    }

    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);

        if (uploadedImage) {
            product.productImage = uploadedImage.secure_url;
        }
    }

    product.productName = productName || product.productName;
    product.description = description || product.description;
    product.costPrice = costPrice ?? product.costPrice;
    product.sellingPrice = sellingPrice ?? product.sellingPrice;
    product.stock = stock ?? product.stock;

    await product.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product updated successfully"
        )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Product deleted successfully"
        )
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const supplier = req.query.supplier || "";
    const sort = req.query.sort || "-createdAt";

    const skip = (page - 1) * limit;

    const filter = {};

    // Search
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

    // Category Filter
    if (category) {
        filter.category = category;
    }

    // Supplier Filter
    if (supplier) {
        filter.supplier = supplier;
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
        .populate("category", "name")
        .populate("supplier", "supplierName companyName")
        .populate("createdBy", "fullName email role")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                products,
                pagination: {
                    page,
                    limit,
                    totalProducts,
                    totalPages: Math.ceil(totalProducts / limit),
                    hasNextPage: page < Math.ceil(totalProducts / limit),
                    hasPrevPage: page > 1,
                },
            },
            "Products fetched successfully"
        )
    );
});




export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
    
  
};