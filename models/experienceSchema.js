import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: "Present",
    },
  },
  { timestamps: true }
);

export const Experience = mongoose.model("Experience", experienceSchema);
