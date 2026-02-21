import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import category from "../models/category_model.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { categoryName, slug } = req.body;

  if (!categoryName || !slug) {
    throw new ApiError(400, "categoryName and slug are required");
  }

  const existingCategory = await category.findOne({ slug });
  if (existingCategory) {
    throw new ApiError(400, "Category with this slug already exists");
  }

  const newCategory = await category.create({
    categoryName,
    slug,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newCategory, "Category created successfully"));
});

export const editCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { categoryName, slug } = req.body;

  const existingCategory = await category.findById(id);
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  if (slug) {
    const slugExists = await category.findOne({ slug, _id: { $ne: id } });
    if (slugExists) {
      throw new ApiError(400, "Category with this slug already exists");
    }
  }

  existingCategory.categoryName = categoryName || existingCategory.categoryName;
  existingCategory.slug = slug || existingCategory.slug;

  await existingCategory.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, existingCategory, "Category updated successfully"),
    );
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingCategory = await category.findById(id);
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  await category.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

export const showAllCategories = asyncHandler(async (req, res) => {
  const categories = await category.find().sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});
