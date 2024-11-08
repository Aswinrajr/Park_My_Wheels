const bcrypt = require("bcrypt");
const vendorModel = require("../../models/venderSchema");
const { uploadImage } = require("../../config/cloudinary");
const generateOTP = require("../../utils/generateOTP");

const vendorForgotPassword = async (req, res) => {
  try {
    const { contactNo } = req.body;

    if (!contactNo) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const existVendor = await vendorModel.findOne({ contactNo });

    if (!existVendor) {
      return res.status(404).json({
        message: "vendor not found with the provided contact number",
      });
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    req.app.locals.otp = otp;
    // req.app.locals.contactNo = contactNo;

    return res.status(200).json({
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (err) {
    console.log("Error in sending OTP in forgot password:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    if (req.app.locals.otp) {
      console.log(" req.app.locals");
      if (otp == req.app.locals.otp) {
        return res.status(200).json({
          message: "OTP verified successfully",
          success: true,
        });
      } else {
        console.log("no req.app.locals");
        return res.status(400).json({
          message: "Invalid OTP",
          success: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "OTP has expired or is invalid",
        success: false,
      });
    }
  } catch (err) {
    console.log("Error in OTP verification:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const vendorChangePassword = async (req, res) => {
  try {
    console.log("Welcome to user change password");

    const { contactNo, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await vendorModel.findOneAndUpdate(
      { contactNo },
      { password: hashedPassword },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log("Error in vendor change password", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const vendorSignup = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const {
      vendorName,
      contactPerson,
      contactNo,
      latitude,
      longitude,
      address,
      landmark,
      password,
    } = req.body;

    const existUser = await vendorModel.findOne({ contactNo });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "User with this contact number already exists." });
    }

    const imageFile = req.file;

    let uploadedImageUrl;

    if (imageFile) {
      uploadedImageUrl = await uploadImage(imageFile.buffer, "vendor_images");
    }

    if (!vendorName || !contactPerson || !contactNo || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new vendorModel({
      vendorName,
      contactPerson,
      contactNo,
      latitude,
      longitude,
      landMark: landmark,

      address,
      password: hashedPassword,
      image: uploadedImageUrl || "",
    });

    await newVendor.save();

    return res.status(201).json({
      message: "Vendor registered successfully",
      vendorDetails: {
        vendorName: newVendor.vendorName,
        contactPerson: newVendor.contactPerson,
        contactNo: newVendor.contactNo,
        latitude: newVendor.latitude,
        longitude: newVendor.longitude,
        landmark: newVendor.landMark,
        address: newVendor.address,
        image: newVendor.image,
      },
    });
  } catch (err) {
    console.error("Error in vendor signup", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const vendorLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res
        .status(400)
        .json({ message: "Mobile number and password are required" });
    }

    const vendor = await vendorModel.findOne({ contactNo: mobile });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({
      message: "Login successful",
      vendorId: vendor._id,
      vendorName: vendor.vendorName,
      contactPerson: vendor.contactPerson,
      contactNo: vendor.contactNo,
      latitude: vendor.location.lat,
      longitude: vendor.location.lng,
      address: vendor.address,
    });
  } catch (err) {
    console.error("Error in vendor login", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  vendorSignup,
  vendorLogin,
  vendorForgotPassword,
  verifyOTP,
  vendorChangePassword,
};
