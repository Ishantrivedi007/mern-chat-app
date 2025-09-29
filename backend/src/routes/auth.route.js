import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

//* For Arcjet middleware test. you can change the max limit to 5 in arcjet.js- (slidingWindow)
// router.get("/test", arcjetProtection, (request, response) => {
//   return response
//     .status(200)
//     .json({ success: true, message: "Arcjet passed!" });
// });

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, (request, response) => {
  return response
    .status(200)
    .json({ success: true, user: request.user, message: "Authorized" });
});

export default router;
