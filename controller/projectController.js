import cloudinary from "../config/cloudinary.js";
import { Project } from "../models/ProjectSchema.js";

const uploadToCloudinary = async (fileBuffer) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "projects_images" }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(fileBuffer);
  });
  return result.secure_url;
};

// export const createProject = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       technologies,
//       liveDemoUrl,
//       githubUrl,
//       isPinned,
//     } = req.body;

//     const techArray = JSON.parse(technologies || "[]");
//     if (techArray.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one technology is required" });
//     }

//     let imageUrl = null;
//     if (req.file) {
//       imageUrl = await uploadToCloudinary(req.file.buffer); // Use the buffer
//     }

//     const project = new Project({
//       title,
//       description,
//       technologies: techArray,
//       liveDemoUrl,
//       githubUrl,
//       isPinned,
//       imageUrl,
//     });

//     await project.save();
//     res.status(201).json({ success: true, message: "Project added!", project });
//   } catch (error) {
//     console.error("Error creating project:", error.message);
//     res.status(500).json({ message: "Failed to create project" });
//   }
// };

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      liveDemoUrl,
      githubUrl,
      isPinned,
      category, // Add category here
    } = req.body;

    const techArray = JSON.parse(technologies || "[]");
    if (techArray.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one technology is required" });
    }

    // Validate category
    const validCategories = ["Full Stack Project", "Frontend With React", "HTML/CSS/JS"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category provided" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const project = new Project({
      title,
      description,
      technologies: techArray,
      liveDemoUrl,
      githubUrl,
      isPinned,
      imageUrl,
      category, // Add category to the project
    });

    await project.save();
    res.status(201).json({ success: true, message: "Project added!", project });
  } catch (error) {
    console.error("Error creating project:", error.message);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// export const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       title,
//       description,
//       technologies,
//       liveDemoUrl,
//       githubUrl,
//       isPinned,
//     } = req.body;

//     let updatedData = {
//       title,
//       description,
//       technologies: JSON.parse(technologies || "[]"),
//       liveDemoUrl,
//       githubUrl,
//       isPinned: isPinned === "true",
//     };

//     if (req.file) {
//       const imageUrl = await uploadToCloudinary(req.file.buffer); // Use the buffer
//       updatedData.imageUrl = imageUrl;
//     }

//     const project = await Project.findByIdAndUpdate(id, updatedData, {
//       new: true,
//     });

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Project updated!", project });
//   } catch (error) {
//     console.error("Error updating project:", error.message);
//     res.status(500).json({ message: "Failed to update project" });
//   }
// };

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      technologies,
      liveDemoUrl,
      githubUrl,
      isPinned,
      category, // Add category here
    } = req.body;

    let updatedData = {
      title,
      description,
      technologies: JSON.parse(technologies || "[]"),
      liveDemoUrl,
      githubUrl,
      isPinned: isPinned === "true",
    };

    // Validate category if provided
    if (category) {
      const validCategories = ["Full Stack Project", "Frontend With React", "HTML/CSS/JS"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category provided" });
      }
      updatedData.category = category;
    }

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updatedData.imageUrl = imageUrl;
    }

    const project = await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Project updated!", project });
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).json({ message: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Project deleted!" });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

// Get All Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ isPinned: -1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.log("Error getting projects:", error.message);
  }
};
