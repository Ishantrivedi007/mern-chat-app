import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (request, response) => {
  const { fullname, email, password } = request.body;
  try {
    if (!fullname || !email || !password) {
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
      fullname,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, response);
      await newUser.save();
      return response.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
        success: true,
        message: "User created successfully",
      });

      //TODO: send welcome email to user
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
  response.send("Signup endpoint");
};
export const logout = async (request, response) => {
  response.send("Signup endpoint");
};
