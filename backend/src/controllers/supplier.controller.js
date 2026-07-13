import { Supplier } from "../models/supplier.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* =========================
   CREATE SUPPLIER
========================= */
const createSupplier = asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);
    const {
        supplierName,
        companyName,
        email,
        phone,
        address,
        gstNumber
    } = req.body;

    // Trim + validation
    if (
        !supplierName?.trim() ||
        !companyName?.trim() ||
        !email?.trim() ||
        !phone?.trim() ||
        !address?.trim()
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    // Duplicate check
    const existedSupplier = await Supplier.findOne({ email });

    if (existedSupplier) {
        throw new ApiError(409, "Supplier already exists");
    }

    const supplier = await Supplier.create({
        supplierName: supplierName.trim(),
        companyName: companyName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        gstNumber: gstNumber?.trim() || "",
        createdBy: req.user?._id
    });

    return res.status(201).json(
        new ApiResponse(201, supplier, "Supplier created successfully")
    );
});

/* =========================
   GET ALL SUPPLIERS
========================= */
const getAllSuppliers = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const filter = search
        ? {
              $or: [
                  {
                      supplierName: {
                          $regex: search,
                          $options: "i"
                      }
                  },
                  {
                      companyName: {
                          $regex: search,
                          $options: "i"
                      }
                  }
              ]
          }
        : {};

    const totalSuppliers = await Supplier.countDocuments(filter);

    const suppliers = await Supplier.find(filter)
        .populate("createdBy", "fullName email role")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                suppliers,
                page,
                limit,
                totalSuppliers,
                totalPages: Math.ceil(totalSuppliers / limit)
            },
            "Suppliers fetched successfully"
        )
    );
});

/* =========================
   GET BY ID
========================= */
const getSupplierById = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id)
        .populate("createdBy", "fullName email role");

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    return res.status(200).json(
        new ApiResponse(200, supplier, "Supplier fetched successfully")
    );
});

/* =========================
   UPDATE SUPPLIER
========================= */
const updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    const {
        supplierName,
        companyName,
        email,
        phone,
        address,
        gstNumber
    } = req.body;

    if (supplierName) supplier.supplierName = supplierName.trim();
    if (companyName) supplier.companyName = companyName.trim();
    if (email) supplier.email = email.trim().toLowerCase();
    if (phone) supplier.phone = phone.trim();
    if (address) supplier.address = address.trim();
    if (gstNumber) supplier.gstNumber = gstNumber.trim();

    await supplier.save();

    return res.status(200).json(
        new ApiResponse(200, supplier, "Supplier updated successfully")
    );
});

/* =========================
   DELETE SUPPLIER
========================= */
const deleteSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    await supplier.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Supplier deleted successfully")
    );
});

/* =========================
   EXPORTS
========================= */
export {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};