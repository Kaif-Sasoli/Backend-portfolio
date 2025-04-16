import mongoose from "mongoose";

const expertiseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["Frontend", "Backend", "Tools"],
  },
  technologies: {
    type: [String],
    required: true,
  },
  icon: {
    type: String, // Store the icon as a base64 string or URL
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Expertise = mongoose.model("Expertise", expertiseSchema);