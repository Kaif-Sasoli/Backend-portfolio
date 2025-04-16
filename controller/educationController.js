import { Education } from "../models/educationSchema.js";

export const getAllDegrees = async (req, res) => {
  try {
    const degrees = await Education.find();
    res.status(200).json({ degrees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const addDegree = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { degree, institution, startDate, endDate } = req.body;

    const existingDegree = await Education.findOne({ degree, user: userId });
    if (existingDegree) {
      return res
        .status(400)
        .json({ message: "Degree already exists for this user" });
    }

    const newEducation = new Education({
      degree,
      institution,
      startDate,
      endDate,
      user: userId,
    });

    await newEducation.save();
    res
      .status(201)
      .json({ message: "Degree added successfully", degree: newEducation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateDegree = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { id } = req.params;
    const { degree, institution, startDate, endDate } = req.body;

    const education = await Education.findOne({ _id: id });
    if (!education) {
      return res
        .status(404)
        .json({ message: "Degree not found or unauthorized" });
    }

    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      { degree, institution, startDate, endDate },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res
      .status(200)
      .json({ message: "Degree updated successfully", updatedEducation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteDegree = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { id } = req.params;

    const education = await Education.findOne({ _id: id });
    if (!education) {
      return res
        .status(404)
        .json({ message: "Degree not found or unauthorized" });
    }

    await Education.findByIdAndDelete(id);
    res.status(200).json({ message: "Degree deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};
