import { Message } from "../models/messageSchema.js";
import nodemailer from "nodemailer";

// Configure Nodemailer transporter for Gmail with secure settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter is ready");
  } catch (error) {
    console.error("Email transporter verification failed:", error);
  }
};

// Verify on startup
verifyTransporter();

// Controller to send a message
export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate the input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Create a new message in the database
    const newMessage = await Message.create({
      name,
      email,
      phone: phone || "",
      message,
    });

    // Send an email notification
    const emailOptions = {
      from: {
        name: "Portfolio Contact Form",
        address: process.env.EMAIL_USER
      },
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Message</h2>
          <p>You have received a new message from your portfolio website:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(emailOptions);
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the request if email fails, but log it
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you within 4 hours.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve messages" });
  }
};

// Controller to delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; // Extract the message ID from the URL parameters

    // Find and delete the message by ID
    const deletedMessage = await Message.findByIdAndDelete(id);

    // Check if the message was found and deleted
    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};