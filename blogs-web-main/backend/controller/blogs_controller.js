import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";
import Blog from "../models/blog_models.js";
import category from "../models/category_model.js";
export const addBlog = asyncHandler(async (req, res) => {
  const { title, content, category, slug } = req.body;

  if (!title || !content || !category || !slug) {
    throw new ApiError(400, "title, content, category and slug are required");
  }

  const slugExists = await Blog.findOne({ slug });
  if (slugExists) {
    throw new ApiError(409, "Blog slug already exists");
  }

  if (!req.file) {
    throw new ApiError(400, "Featured image is required");
  }

  const featuredImage = `/uploads/blogs/${req.file.filename}`;

  const author = req.user._id;

  const blog = await Blog.create({
    title,
    slug,
    content,
    category,
    featuredImage,
    author,
  });

  await blog.populate("author category");

  return res
    .status(201)
    .json(new ApiResponse(201, blog, "Blog created successfully"));
});

export const editBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, category, slug } = req.body;

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  /* slug uniqueness */
  if (slug && slug !== blog.slug) {
    const slugExists = await Blog.findOne({
      slug,
      _id: { $ne: id },
    });

    if (slugExists) {
      throw new ApiError(409, "Slug already exists");
    }
    blog.slug = slug;
  }

  if (title) blog.title = title;
  if (content) blog.content = content;
  if (category) blog.category = category;

  if (req.file) {
    blog.featuredImage = `/uploads/blogs/${req.file.filename}`;
  }

  await blog.save();
  await blog.populate("author category");

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog updated successfully"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // // Optional: only author can delete
  // if (blog.author.toString() !== req.user._id.toString()) {
  //   throw new ApiError(403, "You are not allowed to delete this blog");
  // }

  await blog.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Blog deleted successfully"));
});

export const getAllBlogsfetch = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate("author category")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});
export const getAllBlogs = asyncHandler(async (req, res) => {
  // console.log("Authenticated user:", req.user);

  let filter = {};

  if (req.user.role !== "admin") {
    filter.author = req.user._id;
  }

  const blogs = await Blog.find(filter)
    .populate("author category")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        blogs,
        req.user.role === "admin"
          ? "All blogs fetched successfully"
          : "Your blogs fetched successfully",
      ),
    );
});

export const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id).populate("author category");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug })
    .populate("author", "-password") // 🔥 hide password
    .populate("category");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

export const getBlogsByCategory = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;

  const categoryDoc = await category.findOne({ slug: categorySlug });

  if (!categoryDoc) {
    throw new ApiError(404, "Category not found");
  }

  const blogs = await Blog.find({ category: categoryDoc._id })
    .populate("author category")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

export const searchBlogs = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json(new ApiResponse(200, [], "No search query"));
  }

  const blogs = await Blog.find({
    title: { $regex: q, $options: "i" },
  })
    .populate("author category")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Search result fetched"));
});
