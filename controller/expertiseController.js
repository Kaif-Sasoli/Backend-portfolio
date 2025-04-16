import { Expertise } from "../models/expertiseSchema.js";
import cloudinary from "../config/cloudinary.js";

// Update createExpertise with better error handling
export const createExpertise = async (req, res) => {
  try {
    const { category, technologies, icon } = req.body;

    // Validate technologies array
    if (!Array.isArray(technologies)) {
      return res.status(400).json({ message: "Technologies must be an array" });
    }

    let iconUrl = "";
    if (icon) {
      try {
        const result = await cloudinary.uploader.upload(icon, {
          folder: "expertise-icons",
          transformation: [
            { width: 200, height: 200, crop: "limit" },
            { quality: "auto" },
          ],
        });
        iconUrl = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(400).json({ message: "Failed to upload icon" });
      }
    }

    const newExpertise = new Expertise({
      category,
      technologies,
      icon: iconUrl,
    });

    const savedExpertise = await newExpertise.save();
    res.status(201).json({
      success: true,
      data: savedExpertise,
      message: `${category} expertise added successfully`,
    });
  } catch (error) {
    console.error("Error creating expertise:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update an expertise entry
export const updateExpertise = async (req, res) => {
  try {
    const expertise = await Expertise.findById(req.params.id);
    if (!expertise) {
      return res.status(404).json({ message: "Expertise not found" });
    }

    const { category, technologies, icon } = req.body;
    let iconUrl = expertise.icon;

    if (icon && icon !== expertise.icon) {
      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(icon, {
        folder: "expertise-icons",
      });
      iconUrl = result.secure_url;

      // Optionally, delete the old image from Cloudinary
      if (expertise.icon) {
        const publicId = expertise.icon.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`expertise-icons/${publicId}`);
      }
    }

    const updatedExpertise = await Expertise.findByIdAndUpdate(
      req.params.id,
      { category, technologies, icon: iconUrl },
      { new: true }
    );
    res.status(200).json({
      message: `${category} is updated successfully!`,
      updatedExpertise,
    });
  } catch (error) {
    console.error("Error updating expertise:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllExpertise = async (req, res) => {
  try {
    const expertise = await Expertise.find();
    res.status(200).json(expertise);
  } catch (error) {
    console.error("Error fetching expertise:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getExpertiseById = async (req, res) => {
  try {
    const expertise = await Expertise.findById(req.params.id);
    if (!expertise) {
      return res.status(404).json({ message: "Expertise not found" });
    }
    res.status(200).json(expertise);
  } catch (error) {
    console.error("Error fetching expertise by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpertise = async (req, res) => {
  try {
    const expertise = await Expertise.findById(req.params.id);
    if (!expertise) {
      return res.status(404).json({ message: "Expertise not found" });
    }

    // Optionally, delete the image from Cloudinary
    if (expertise.icon) {
      const publicId = expertise.icon.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`expertise-icons/${publicId}`);
    }

    await Expertise.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `${expertise.category} is deleted successfully!`,
    });
  } catch (error) {
    console.error("Error deleting expertise:", error);
    res.status(500).json({ message: error.message });
  }
};