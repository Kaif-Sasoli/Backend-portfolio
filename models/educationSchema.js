import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, "Degree is required!"],
      unique: [true],
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
  },
  { timestamps: true }
);

export const Education = mongoose.model("Education", educationSchema);
