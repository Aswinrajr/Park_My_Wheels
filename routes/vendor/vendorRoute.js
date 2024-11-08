const express = require("express");
const multer = require("multer");
const vendorRoute = express.Router();
const vendorController = require("../../controller/vendorController/vendorController");


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


vendorRoute.post("/forgotpassword",vendorController.vendorForgotPassword)
vendorRoute.post("/verify-otp",vendorController.verifyOTP)
vendorRoute.post("/resend-otp",vendorController.vendorForgotPassword)
vendorRoute.post("/change-password",userController.vendorChangePassword)




// Routes
vendorRoute.post("/signup", upload.single("image"), vendorController.vendorSignup);
vendorRoute.post("/login", vendorController.vendorLogin);



module.exports = vendorRoute;
