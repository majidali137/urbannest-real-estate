const express = require("express");
const router = express.Router();
const {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  generateOtp,
  resetPassword,
  testEmail,
  verifyOtp,
  googleAuth,
  getAllUsers,
  deleteUsers,
  protectAdmin,
  getUserById,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// router.get('/', test)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.get("/logout", logoutUser);
router.get("/forgot-password", generateOtp);
router.get("/forgot-password/otp", verifyOtp);
router.post("/resetPassword", resetPassword);
router.get("/email-test", testEmail);
router.get("/user/:id", getUserById);

router.post("/auth/google", googleAuth);

router.get("/get-all-users", authMiddleware, getAllUsers);

router.delete("/delete-user/:id", authMiddleware, deleteUsers);

module.exports = router;
