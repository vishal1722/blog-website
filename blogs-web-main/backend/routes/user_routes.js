import express from "express";
import upload from "../config/multer.js";
import {
  deleteUser,
  getAllUsers,
  getuser,
  updateUser,
} from "../controller/user_controller.js";
import { verifyJWT } from "../middleware/auth_middleware.js";

const router = express.Router();


router.get("/users", verifyJWT, getAllUsers);
router.delete("/users/:id", verifyJWT, deleteUser);

router.get("/get-user/:id", verifyJWT, getuser);
router.put(
  "/update-user/:id",
  verifyJWT,
  upload.single("file"),
  updateUser
);

export default router;
