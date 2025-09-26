import express from "express";

const router = express.Router();

router.get("/api/auth/signup", (request, response) => {
  response.send("Signup endpoint");
});
router.get("/api/auth/login", (request, response) => {
  response.send("login endpoint");
});
router.get("/api/auth/logout", (request, response) => {
  response.send("logout endpoint");
});

export default router;
