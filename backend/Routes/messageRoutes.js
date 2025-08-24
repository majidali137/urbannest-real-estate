const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/send-message", verifyToken, sendMessage);
router.get("/get-messages/:chatId", verifyToken, getAllMessages);

module.exports = router;
