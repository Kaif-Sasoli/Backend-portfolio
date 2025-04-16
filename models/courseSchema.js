import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    institution: {
      type: String,
      required: [true, "Institution is required!"],
    },
    startDate: {
      type: String,
      required: [true, "Start date is required!"],
    },
    endDate: { type: String },
    viewCredentials: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

courseSchema.index({ title: 1, user: 1 }, { unique: true });

export const Course = mongoose.model("Course", courseSchema);
