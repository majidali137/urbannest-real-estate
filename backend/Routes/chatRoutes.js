const express = require("express");
const router = express.Router();
const { accessChat, fetchChats } = require("../controllers/chatController");
const {
  verifyToken,
  authMiddleware,
} = require("../middlewares/authMiddleware");

router.post("/access-chat", authMiddleware, accessChat);
router.get("/fetch-chats", authMiddleware, fetchChats);

module.exports = router;
