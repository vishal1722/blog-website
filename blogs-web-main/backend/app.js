import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import categoryRoutes from "./routes/category_routes.js";
import blogsRoutes from "./routes/blogs_routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import  commentsRoutes from "./routes/comments_routes.js";
import likeROuter from "./routes/like_routes.js"
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/auth/v1", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/blogs", blogsRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/likes", likeROuter);
app.get("/", (req, res) => {
  res.send("welcome to backend");
});
app.use(errorHandler);
export default app;
