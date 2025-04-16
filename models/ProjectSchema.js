// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String },
//     technologies: [String],
//     liveDemoUrl: String,
//     githubUrl: String,
//     imageUrl: String,
//     isPinned: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export const Project = mongoose.model("Project", projectSchema);


// models/ProjectSchema.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  liveDemoUrl: { type: String },
  githubUrl: { type: String },
  isPinned: { type: Boolean, default: false },
  imageUrl: { type: String },
  category: {
    type: String,
    enum: ["Full Stack Project", "Frontend With React", "HTML/CSS/JS"], // Restrict to these categories
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model("Project", ProjectSchema);