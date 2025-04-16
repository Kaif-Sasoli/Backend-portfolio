import { Experience } from "../models/experienceSchema.js";

// Get all experiences
export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.status(200).json({ experiences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Add new experience
export const addExperience = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { role, company, location, remote, startDate, endDate } = req.body;

    // Validation: Ensure required fields are provided
    if (!role || !company || !location || !startDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const newExperience = new Experience({
      role,
      company,
      location,
      remote: remote || false,
      startDate,
      endDate: endDate || "Present", // Default to "Present" if not provided
    });

    await newExperience.save();
    res.status(201).json({
      message: "Experience added successfully",
      experience: newExperience,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Update experience
export const updateExperience = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { role, company, location, remote, startDate, endDate } = req.body;

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Update only provided fields
    experience.role = role || experience.role;
    experience.company = company || experience.company;
    experience.location = location || experience.location;
    experience.remote = remote !== undefined ? remote : experience.remote;
    experience.startDate = startDate || experience.startDate;
    experience.endDate = endDate !== undefined ? endDate : experience.endDate;

    await experience.save();
    res
      .status(200)
      .json({ message: "Experience updated successfully", experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Delete experience
export const deleteExperience = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    await experience.deleteOne();
    res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
