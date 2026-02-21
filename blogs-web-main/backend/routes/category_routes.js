import express from "express";
import {
  addCategory,
  deleteCategory,
  editCategory,
  showAllCategories,
} from "../controller/category_controller.js";
import { verifyJWT } from "../middleware/auth_middleware.js";
import { isAdmin } from "../middleware/isAdmin_middleware.js";
const router = express.Router();

router.post("/add", verifyJWT, isAdmin, addCategory);
router.put("/edit/:id", verifyJWT, isAdmin, editCategory);
router.delete("/delete/:id", verifyJWT, isAdmin, deleteCategory);

router.get("/all", showAllCategories);

export default router;
