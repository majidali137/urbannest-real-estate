const asynchandler = require("express-async-handler");
const Chat = require("../models/chat");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Notification = require("../models/notification");
const Message = require("../models/message");
const NotificationModel = require("../models/notification");

const accessChat = asynchandler(async (req, res) => {
  const { userId } = req.body;
  const { _id } = req.user;

  console.log(userId);

  if (!userId) {
    console.log("Invalid seller Id");
    res.sendStatus(400);
  }

  const loggedInUser = _id.toString();
  if (loggedInUser === userId) {
    return res.json({ error: "You can not contact with yourself :)" });
  }

  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: loggedInUser } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username avatar email",
  });
  if (isChat.length > 0) {
    isChat[0].lastRead.set(loggedInUser, new Date());
    const deletedNotification = await NotificationModel.deleteMany({
      user: loggedInUser,
      chat: isChat[0]._id,
    });
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [loggedInUser, userId],
    };

    try {
      const existingChat = await Chat.findOne({
        users: { $all: [loggedInUser, userId] }, // Both users should be in the chat
      });

      if (existingChat) {
        existingChat.lastRead.set(loggedInUser, new Date());
        const deletedNotification = await NotificationModel.deleteMany({
          user: loggedInUser,
          chat: existingChat._id,
        });
        await existingChat.save();
        return res.json(existingChat);
      }
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asynchandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage",
          select: "username avatar email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChats,
};
