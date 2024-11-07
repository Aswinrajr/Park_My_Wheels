const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    landMark: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
