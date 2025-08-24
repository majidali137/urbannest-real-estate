const express = require("express");
const router = express.Router();
const {
  requestForSeller,
  completeProfile,
  toggleSelling,
  profileImageUpload,
} = require("../controllers/sellerController");
const {
  verifySellingProfile,
  authMiddleware,
  verifyToken,
} = require("../middlewares/authMiddleware");

router.patch(
  "/become-a-seller",
  authMiddleware,
  verifySellingProfile,
  requestForSeller
);
router.patch("/complete-profile", verifyToken, completeProfile);
router.patch(
  "/toggle-selling",
  authMiddleware,
  verifySellingProfile,
  toggleSelling
);
router.patch("/upload-profile-image", profileImageUpload);

module.exports = router;
