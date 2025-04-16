import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userSchema.js";
import mongoose from "mongoose";
dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password!" });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Check if admin user already exists
      let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });

      if (!adminUser) {
        adminUser = new User({
          _id: new mongoose.Types.ObjectId(),
          name: "Khadim Ali",
          ProfessionalTitle: "Frontend Developer",
          role: "Admin",
          aboutText:
            "Experienced React Frontend Developer specializing in crafting scalable, high-performance web applications. Dedicated to creating seamless user experiences through innovative solutions, solving complex problems, and tackling intricate technical challenges with passion and precision.",
          email: process.env.ADMIN_EMAIL,
          phone: "+923490393306",
          location: "Pakistan",
          website: "https://khadim-dev.vercel.app/",
          githubURL: "https://github.com/developer-khadim",
          linkedinURL: "https://www.linkedin.com/in/khadim-ali12/",
// ,
//           facebookURL: "https://facebook.com/abdulalisoomro2k23",
          dribbbleURL: "",
          behanceURL: "",
        });

        await adminUser.save();
      }

      const token = jwt.sign(
        { id: adminUser._id, role: adminUser.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json({
          success: true,
          message: "Admin Login Successfully!",
          user: adminUser,
          token,
        });
    } else {
      console.log("Error: Invalid email or password.");
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        ProfessionalTitle: user.ProfessionalTitle,
        role: user.role,
        aboutText: user.aboutText,
        email: user.email,
        phone: user.phone,
        location: user.location,
        website: user.website,
        githubURL: user.githubURL,
        linkedinURL: user.linkedinURL,
        twitterURL: user.twitterURL,
        facebookURL: user.facebookURL,
        dribbbleURL: user.dribbbleURL,
        behanceURL: user.behanceURL,
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User updated successfully!", user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutUser = (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
      })
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
