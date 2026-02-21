import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userBlog",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
