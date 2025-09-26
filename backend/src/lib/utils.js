import jwt from "jsonwebtoken";

export const generateToken = (userId, response) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  response.cookie("mern-chat-app", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, //prevent XSS attacks
    sameSite: "strict", //CSRF protection
    secure: process.env.NODE_ENV === "development" ? false : true, //set to true in production
  });
  return token;
};
