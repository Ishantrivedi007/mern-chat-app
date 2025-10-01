import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    //extract token from http cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("mern-chat-app="))
      ?.split("=")[1];
    // const token =
    //   socket.handshake.auth?.token ||
    //   socket.handshake.headers.cookie
    //     ?.split("; ")
    //     .find((row) => row.startsWith("mern-chat-app="))
    //     ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No Token provided.");
      return next(new Error("Unauthorized - token not provided."));
    }

    //verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid Token.");
      return next(new Error("Unauthorized - invalid token."));
    }

    //find the user from db
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("Socket connection rejected: User not found.");
      return next(new Error("Unauthorized - user not found."));
    }
    //attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();
    console.log(
      `Socket connection accepted for user: ${user.fullName} (${user._id})`
    );

    next();
  } catch (error) {
    console.log("Error in socketAuthMiddleware middleware: ", error.message);
    next(new Error("Unauthorized - socket authentication failed."));
  }
};
