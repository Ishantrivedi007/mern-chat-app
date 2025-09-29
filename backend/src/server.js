import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import authroutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authroutes);
app.use("/api/messages", messageRoutes);

//make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (request, response) => {
    response.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
