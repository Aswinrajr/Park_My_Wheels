const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");
const vehicleModel = require("../../models/vehicleModel");
const { uploadImage } = require("../../config/cloudinary");




const getUserDataHome = async (req, res) => {
  try {
    console.log("Welcome to get data in home");

    const { id } = req.query; // User ID passed as a query parameter

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

 
    const userData = await userModel.findOne({uuid:id},{userPassword:0});
    console.log(userData)


   
    if (!userData) {
      return res.status(404).json({
        message: "User not found",
      });
    }

   
    res.status(200).json({
      message: "User data retrieved successfully",
      user: userData,
    });
  } catch (err) {
    console.error("Error in getting user data in home", err);
    res.status(500).json({
      message: "Error in getting user data",
      error: err.message,
    });
  }
};










const getUserData = async (req, res) => {
  try {
    console.log("Welcome to getting the user data", req.query);

    const { id } = req.query; // User ID passed as a query parameter

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userData = await userModel.findOne({ uuid: id }, { userPassword: 0 });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      data: userData,
    });
  } catch (err) {
    console.error("Error in getting user profile data", err);

    res.status(500).json({
      success: false,
      message: "Server error in retrieving user data",
      error: err.message,
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    console.log("Updating user data", req.query, req.body);

    const { id } = req.query; // User UUID passed as a query parameter
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User UUID is required in query parameters",
      });
    }

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({
        success: false,
        message: "Updates object is required in the request body",
      });
    }

    // Find the user by UUID and update their information
    const updatedUser = await userModel.findOneAndUpdate(
      { uuid: id }, // Search by userUUID
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User data updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error in updating user data", err);

    res.status(500).json({
      success: false,
      message: "Server error in updating user data",
      error: err.message,
    });
  }
};

const getUserVehicleData = async (req, res) => {
  try {
    console.log("Welcome to get all user vehicle data");

    const { id } = req.query; // User ID passed as a query parameter
    console.log(id)

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const userVehicles = await vehicleModel.find({ userId: id });

    if (userVehicles.length === 0) {
      return res.status(404).json({
        message: "No vehicles found for this user",
      });
    }

    res.status(200).json({
      message: "User vehicle data retrieved successfully",
      vehicles: userVehicles,
    });
  } catch (err) {
    console.error("Error in getting the user vehicle data", err);
    res.status(500).json({
      message: "Error in getting the user vehicle data",
      error: err.message,
    });
  }
};


const addNewVehicle = async (req, res) => {
  try {
    const { id } = req.query;
    const { category, type, make, model, color, vehicleNo } = req.body;

    // Check if an image is provided
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Since we're using memory storage, the image will be in req.files.image
    const imageFile = req.files.image[0];

    // Upload the image to Cloudinary
    const imageUrl = await uploadImage(imageFile.buffer, "vehicles"); // Specify the folder

    // Create a new vehicle document
    const newVehicle = new vehicleModel({
      image: imageUrl, // Save the image URL
      category,
      type,
      make,
      model,
      color,
      vehicleNo,
      userId: id,
    });

    const savedVehicle = await newVehicle.save();

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle: savedVehicle,
    });
  } catch (err) {
    console.error("Error in adding vehicle", err);
    res.status(500).json({
      message: "Error in adding vehicle",
      error: err.message,
    });
  }
};



module.exports = {
  getUserData,
  updateUserData,
  addNewVehicle,
  getUserVehicleData,
  getUserDataHome
};
