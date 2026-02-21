import express from "express";
import { getLikeInfo, toggleLike } from "../controller/like_controller.js";
import { verifyJWT } from "../middleware/auth_middleware.js";
const router = express.Router();

router.get("/:blogId", verifyJWT, getLikeInfo);

router.post("/toggle/:blogId", verifyJWT, toggleLike);

export default router;
