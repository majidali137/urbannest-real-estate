const express = require("express");
const User = require("../models/user");
const Listing = require("../models/listings");
const RoleModel = require("../models/role");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePasswords } = require("../helpers/auth");
const Chat = require("../models/chat");
const Message = require("../models/message");

const test = (req, res) => {
  res.json("test is working");
};

// user register

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username) {
      return res.json({
        error: "Name is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be atleast 6 characters",
      });
    }
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email already exists",
      });
    }
    const hashedPassword = await hashPassword(password);

    const buyerRole = new RoleModel({
      name: "buyer",
      permissions: ["read"],
    });
    const savedBuyerRole = await buyerRole.save();
    const buyerRoleId = savedBuyerRole._id;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roles: [buyerRoleId],
      seller: false,
      fullName: null,
      phone: null,
      city: null,
    });
   
    return res.json(user);
  } catch (error) {
    console.log(error);
  } 
};


// user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({
        error: "Email required to login",
      });
    }

    if (!password) {
      return res.json({
        error: "Password required to login",
      });
    }

    const user = await User.findOne({ email: email }).populate("roles");

    if (!user) {
      return res.json({
        error: "User does not exist with this email!",
      });
    }

    //Sending cookie using jwt and Check for password match
    const match = await comparePasswords(password, user.password);
    if (match) {
      jwt.sign(
        {
          email: user.email,
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          roles: user.roles,
          seller: user.seller,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token, { httpOnly: false }).json({
            ...user._doc,
            roles: user.roles,
          });
        }
      );
    }
    if (!match) {
      return res.json({
        error: "Password do not match",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// get user profile

const getProfile = async (req, res) => {
  const user = req.user;
  try {
    if (user) {
      res.json(user);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error("Error getting profile", error);
  }
};

// get logout user

const logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
};

// const generateOtp = async (req, res) => {
//   const { email } = req.query;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.json({
//         error: "No user exist with this email",
//       });
//     }
//     const code = otpGenerator.generate(6, {
//       lowerCaseAlphabets: false,
//       upperCaseAlphabets: false,
//       specialChars: false,
//     });

//     const otp = await Otp.findOne({ email });
//     if (!otp) {
//       const user = await Otp.create({ email: email, otp: code });
//       console.log("Otp generated");
//     } else {
//       const user = await Otp.updateOne({ email: email }, { otp: code });
//       console.log("Otp generated");
//     }
//     sendMail({
//       username: user.username,
//       userEmail: email,
//       text: `Your otp is: ${code}`,
//       subject: "Forgot Password",
//     });
//     console.log(`Email sent to ${email}`);
//     res
//       .status(201)
//       .json({ message: "A 6 digit OTP has been sent to your mail" });
//   } catch (error) {
//     res.status(401).json({ error: "OTP generation failed" });
//   }
// };

// const verifyOtp = async (req, res) => {
//   const { email, otp } = req.query;

//   try {
//     const otpDoc = await Otp.findOne({ email }).exec();

//     if (otpDoc && otpDoc.otp == otp) {
//       await Otp.deleteOne({ email: email });
//       return res.status(201).json({ message: "Otp matched" });
//     } else {
//       return res.status(201).json({ error: "OTP does not match" });
//     }
//   } catch (error) {
//     return res.json({ error: "Error while verifying otp" });
//   }
// };

// const resetPassword = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Hash the new password
//     const hashedPassword = await hashPassword(password);

//     // Update the user's password
//     await User.updateOne({ email: user.email }, { password: hashedPassword });

//     res.json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error("Error while resetting the password", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const googleAuth = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {

      const token = jwt.sign(
        {
          email: user.email,
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          roles: user.roles,
          seller: user.seller,
        },
        process.env.JWT_SECRET
      );

      const { password: password, ...rest } = user._doc;
      res.cookie("token", token, { httpOnly: false }).status(200).json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPassword(generatedPassword);

      const buyerRole = new RoleModel({
        name: "buyer",
        permissions: ["read"],
      });
      const savedBuyerRole = await buyerRole.save();
      const buyerRoleId = savedBuyerRole._id;

      const newUser = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
        roles: [buyerRoleId],
        seller: false,
        fullName: null,
        phone: null,
        city: null,
      });
      await newUser.save();
      const token = jwt.sign(
        {
          email: newUser.email,
          _id: newUser._id,
          username: newUser.username,
          avatar: newUser.avatar,
          roles: [buyerRoleId],
          seller: newUser.seller,
        },
        process.env.JWT_SECRET
      );

      const { password: password, ...rest } = newUser._doc;
      res.cookie("token", token).status(200).json(rest);
    }
  } catch (error) {
    res.json({ error: "Login failed with google" });
  }
};

const getAllUsers = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ error: "No user found" });
  }

  const searchTerm = req.query.searchTerm || "";

  if (user.roles[0].name !== "admin") {
    return res
      .status(404)
      .json({ error: "Access denied, only admins can get all users" });
  }
  try {
    const users = await User.find(
      { username: { $regex: searchTerm, $options: "i" } },
      { password: 0 }
    );
    const filteredUsers = users.filter(
      (user) => user.roles[0].name !== "admin"
    );
    return res.status(200).json(filteredUsers);
  } catch (error) {
    return res.json({ error: "Error fetching the users" });
  }
};

const deleteUsers = async (req, res) => {
  const { roles } = req.user;
  if (roles.name !== "admin" || !req.user) {
    res.status(400).json({ error: "Only admin can delete users" });
  }
  const id = req.params.id;
  try {
    const listings = await Listing.deleteMany({ userRef: id });
    const chats = await Chat.find({ users: id });
    const chatIds = chats.map((chat) => chat._id);
    const messages = await Message.deleteMany({ chat: { $in: chatIds } });
    const deletedChats = await Chat.deleteMany({ _id: { $in: chatIds } });
    const user = await User.findByIdAndDelete({ _id: id });
    res.status(200).json({ success: "User successfully deleted" });
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id }, { password: 0 });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.json({ error: "Error getting user" });
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  // generateOtp,
  // verifyOtp,
  // resetPassword,
  googleAuth,
  getAllUsers,
  deleteUsers,
  getUserById,
};
