import express from "express";
import {
  register,
  login,
  googleLogin,
  logout,
} from "../controller/auth_controller.js";
import { verifyJWT } from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/logout", verifyJWT, logout);
export default router;
