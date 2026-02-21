import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
connectDB();
import app from "./app.js";

const PORT = process.env.PORT || 8000;
// import mongoose from "mongoose";
// console.log(mongoose.modelNames());

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});

