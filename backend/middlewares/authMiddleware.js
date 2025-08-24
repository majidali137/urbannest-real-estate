const jwt = require("jsonwebtoken");
const User = require("../models/user");


const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.json(null);
    }
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      const user = await User.findById(decoded._id).populate("roles").exec();

      if (!user) return res.status(404).json({ error: "No user found" });

      req.user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        seller: user.seller,
        roles: user.roles,
        fullName: user.fullName,
        city: user.city,
        phone: user.phone,
        favorites: user.favorites,
      };

      next();
    });
  } catch (error) {
    console.error(error);
  }
};

const verifySellingProfile = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      res.json({ error: "You are not logged in" });
    }

    if (!user.username || !user.fullName || !user.city || !user.phone) {
      return res.json({ uncomplete: "Please complete your profile" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.error({ error: "Error becoming a seller" });
  }
};

const verifyToken = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.json(null);
    }
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(201).json({ error: "Error while posting." });
  }
};

module.exports = {
  authMiddleware,
  verifySellingProfile,
  verifyToken,
};
