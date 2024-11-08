const express = require("express");
const multer = require("multer");
const userRoute = express();

// Import controllers
const userController = require("../../controller/userController/userAuthController");
const userProfileController = require("../../controller/userController/userProfileController");

// Configure multer for file uploads
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

userRoute.post("/forgotpassword",userController.userForgotPassword)
userRoute.post("/verify-otp",userController.verifyOTP)
userRoute.post("/resend-otp",userController.userForgotPassword)
userRoute.post("/change-password",userController.userChangePassword)




// User authentication routes
userRoute.post("/signup", userController.userSignUp);
userRoute.post("/login", userController.userVerification);

// User profile routes
userRoute.get("/get-userdata", userProfileController.getUserData);
userRoute.post("/update-userdata", upload.fields([{ name: 'image', maxCount: 1 }]), userProfileController.updateUserData);

// Home data route
userRoute.get("/home", userProfileController.getUserDataHome);

// Vehicle data routes
userRoute.get("/get-vehicle", userProfileController.getUserVehicleData);

// Add vehicle route with file upload
userRoute.post("/add-vehicle", upload.fields([{ name: 'image' }]), userProfileController.addNewVehicle);

//Booking the slot for parking
userRoute.post("/book-parking-slot", userProfileController.bookParkingSlot);

//Get vehicle data in car booking
userRoute.get("/get-vehicle-slot", userProfileController.getUserVehicleData);



// Export the router
module.exports = userRoute;
