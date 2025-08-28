const mongoose = require("mongoose");
const { Schema } = mongoose;

const optSchema = new Schema({
  otp: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
  },
});

const Otp = mongoose.model("Otp", optSchema);
module.exports = Otp;
