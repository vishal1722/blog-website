import express from "express";
import blogUpload from "../middleware/blogUpload_middleware.js";
import {
  addBlog,
  getAllBlogs,
  deleteBlog,
  editBlog,
  getSingleBlog,
  getBlogBySlug,
  getBlogsByCategory,
  searchBlogs,
  getAllBlogsfetch,
} from "../controller/blogs_controller.js";
import { verifyJWT } from "../middleware/auth_middleware.js";

const router = express.Router();

// 🔒 PROTECTED
router.post("/add-blog", verifyJWT, blogUpload.single("image"), addBlog);

router.put("/edit/:id", verifyJWT, blogUpload.single("image"), editBlog);

router.delete("/delete/:id", verifyJWT, deleteBlog);
router.get("/all-blogs", verifyJWT, getAllBlogs);

// 🔓 PUBLIC
router.get("/blogs", getAllBlogsfetch);
router.get("/search", searchBlogs);
router.get("/getblogbycategory/:categorySlug", getBlogsByCategory);
router.get("/blog/:slug", getBlogBySlug);
router.get("/:id", getSingleBlog);

export default router;
