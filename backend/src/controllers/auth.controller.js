import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (request, response) => {
  const { fullName, email, password } = request.body;
  try {
    if (!fullName || !email || !password) {
      return response
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password.length < 6) {
      return response.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    //check if email is valid : regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return response.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id, response);
      response.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        success: true,
        message: "User created successfully",
      });
      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL
        );
      } catch (error) {
        console.error("Error sending welcome email:", error);
      }
    } else {
      return response.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
export const login = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid Credentials." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid Credentials." });
    }
    generateToken(user._id, response);
    return response.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in login controller: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
export const logout = async (_, response) => {
  response.cookie("mern-chat-app", "", { maxAge: 0 });
  return response
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
};

export const updateProfile = async (request, response) => {
  try {
    const { profilePic } = request.body;
    if (!profilePic) {
      return response
        .status(400)
        .json({ success: false, message: "Profile picture is required." });
    }
    const userId = request.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    ).select("-password");
    return response.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile controller: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
