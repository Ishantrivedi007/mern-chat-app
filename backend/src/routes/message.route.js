import express from "express";

const router = express.Router();

router.get("/send", (request, response) => {
  response.send("Send message endpoint");
});

export default router;
