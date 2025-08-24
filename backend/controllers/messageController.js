const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Message = require("../models/message");
const UserModel = require("../models/user");
const Chat = require("../models/chat");
const NotificationModel = require("../models/notification");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  const { token } = req.cookies;

  if (!token) {
    res.status(400).json({ error: "User not logged In" });
  }

  if ((!chatId, !content)) {
    console.log("Invalid data passed into the request");
    return res
      .sendStatus(400)
      .json({ error: "Invalid Data passed into the request" });
  }

  var senderId = "";

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
    if (err) {
      console.log(err);
      return res.json({ error: "Error sending the message" });
    }
    senderId = user._id;
  });
  console.log(senderId);

  var newMessage = {
    sender: senderId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username avatar");
    message = await message.populate("chat");
    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "username avatar email",
    });

    const chat = await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    }).populate("users");

    chat.users.forEach(async (user) => {
      if (
        user._id.toString() !== senderId.toString() &&
        !chat.activeUsers.includes(user._id)
      ) {
        const lastRead = chat.lastRead.get(user._id.toString);
        const messageCreatedAt = message.createdAt;

        console.log(lastRead);
        console.log(messageCreatedAt);

        if (!lastRead || messageCreatedAt > lastRead) {
          const notification = new NotificationModel({
            user: user._id,
            chat: chatId,
            message: message._id,
          });
          await notification.save();
        }
      }
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username avatar email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  sendMessage,
  getAllMessages,
};
