import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (request, response, next) => {
  try {
    const token = request.cookies["mern-chat-app"];
    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized - token not provided.",
      });
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized - invalid token.",
      });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "Unauthorized - user not found.",
      });
    }
    request.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
