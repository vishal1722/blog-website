import express from "express";
import {
  addComment,
  getCommentsByBlog,
  deleteComment,
  commentCount,
} from "../controller/comments_controller.js";
import { verifyJWT } from "../middleware/auth_middleware.js";

const router = express.Router();

// 🔒 Protected
router.post("/add-comment", verifyJWT, addComment);
router.delete("/delete-comment/:commentId", verifyJWT, deleteComment);

// 🔓 Public
router.get("/comments/:blogId", getCommentsByBlog);
router.get("/count/:blogId", commentCount);

export default router;
