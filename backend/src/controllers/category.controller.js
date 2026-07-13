import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const existedCategory = await Category.findOne({ name });

  if (existedCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await Category.create({
    name,
    description,
    createdBy: req.user._id,
  });

  const populatedCategory = await Category.findById(category._id).populate(
    "createdBy",
    "fullname email role"
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      populatedCategory,
      "Category created successfully"
    )
  );
});

const getAllCategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const sort = req.query.sort || "latest";

  const query = {};

  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  let sortOption = {};

  switch (sort) {
    case "az":
      sortOption = { name: 1 };
      break;

    case "za":
      sortOption = { name: -1 };
      break;

    case "oldest":
      sortOption = { createdAt: 1 };
      break;

    default:
      sortOption = { createdAt: -1 };
  }

  const totalCategories = await Category.countDocuments(query);

  const categories = await Category.find(query)
    .populate("createdBy", "fullName email role")
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        categories,
        totalCategories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
      },
      "Categories fetched successfully"
    )
  );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    "createdBy",
    "fullname email role"
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      category,
      "Category fetched successfully"
    )
  );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (name) category.name = name;
  if (description) category.description = description;

  await category.save();

  const updatedCategory = await Category.findById(category._id).populate(
    "createdBy",
    "fullname email role"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedCategory,
      "Category updated successfully"
    )
  );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await Category.findByIdAndDelete(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Category deleted successfully"
    )
  );
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};