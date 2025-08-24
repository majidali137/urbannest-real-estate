const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },

  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  seller: {
    type: Boolean,
    default: false,
  },
  fullName: {
    type: String,
  },
  phone: {
    type: String,
  },
  city: {
    type: String,
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
