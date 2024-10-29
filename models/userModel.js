const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userMobile: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    vehicleNo: {
      type: String,
    },

    role: {
      type: String,
      default: "user",
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
