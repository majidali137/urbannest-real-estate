const Chat = require("../models/chat");
const NotificationModel = require("../models/notification");

const enterChat = async (req, res) => {
  const loggedUser = req.user;
  const { chatId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat.activeUsers.includes(loggedUser._id)) {
      chat.activeUsers.push(loggedUser._id);
      await chat.save();
    }

    const deletedNotification = await NotificationModel.deleteMany({
      user: loggedUser._id,
      chat: chat._id,
    });
    const notifications = await NotificationModel.find({
      user: loggedUser._id,
    }).populate("message");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ error: "Error entering the chat" });
  }
};

const leaveChat = async (req, res) => {
  const loggedUser = req.user;
  const { chatId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    chat.activeUsers = chat.activeUsers.filter(
      (userId) => userId.toString() !== loggedUser._id.toString()
    );
    await chat.save();
    res.status(200).json({ success: "Chat left" });
  } catch (error) {
    res.status(400).json({ error: "Error leaving the chat" });
  }
};

const leaveAllChats = async (req, res) => {
  const loggedInUser = req.user;

  try {
    await Chat.updateMany(
      { activeUsers: loggedInUser._id.toString() },
      { $pull: { activeUsers: loggedInUser._id.toString() } }
    );
  } catch (error) {
    console.error(error);
    res.status(400);
  }
};

const getNotifications = async (req, res) => {
  const loggedUser = req.user;
  try {
    const notifications = await NotificationModel.find({ user: loggedUser._id })
      .populate({
        path: "chat",
        populate: {
          path: "users", 
          model: "User",
          select: "username email", 
        },
      })
      .populate("message")
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ error: "Error fetching notifications" });
  }
};

module.exports = {
  enterChat,
  leaveChat,
  getNotifications,
  leaveAllChats,
};
