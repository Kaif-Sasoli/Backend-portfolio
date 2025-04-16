import { Course } from "../models/courseSchema.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const addCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { title, institution, startDate, endDate, viewCredentials } =
      req.body;

    const existingCourse = await Course.findOne({ title, user: userId });
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: "Course already exists for this user" });
    }

    const newCourse = new Course({
      title,
      institution,
      startDate,
      endDate,
      viewCredentials,
      user: userId,
    });

    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { title, institution, startDate, endDate, viewCredentials } =
      req.body;

    const course = await Course.findOne({ _id: id });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or unauthorized" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title, institution, startDate, endDate, viewCredentials },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res
      .status(200)
      .json({ message: "Course updated successfully", updatedCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const course = await Course.findOne({ _id: id });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or unauthorized" });
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};
