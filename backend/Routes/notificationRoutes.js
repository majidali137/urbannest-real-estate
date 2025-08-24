const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  enterChat,
  leaveChat,
  getNotifications,
  leaveAllChats,
} = require("../controllers/notificationController");

router.post("/enter-chat", authMiddleware, enterChat);
router.post("/leave-chat", authMiddleware, leaveChat);
router.get("/get-notification", authMiddleware, getNotifications);
router.put("/leave-all-chats", authMiddleware, leaveAllChats);

module.exports = router;
