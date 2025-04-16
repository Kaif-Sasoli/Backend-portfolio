import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  ProfessionalTitle: String,
  role: String,
  aboutText: String,
  email: String,
  phone: String,
  location: String,
  website: String,
  githubURL: String,
  linkedinURL: String,
  twitterURL: String,
  facebookURL: String,
  dribbbleURL: String,
  behanceURL: String,
});

const User = mongoose.model("User", userSchema);

export default User;
