const express = require("express");
const userRoute = express();

const userController = require("../../controller/userController/userAuthController");
const userProfileController = require("../../controller/userController/userProfileController")

userRoute.post("/signup", userController.userSignUp);
userRoute.post("/login", userController.userVerification);


// GET DATA IN USER PROFILE PAGE

userRoute.get("/get-userdata",userProfileController.getUserData);
userRoute.post("/update-userdata",userProfileController.updateUserData);


//GET THE USER VEHICLE DATA
userRoute.get("/get-vehicle",userProfileController.getUserVehicleData);



//ADD VEHICLE
userRoute.post("/add-vehicle",userProfileController.addNewVehicle);








module.exports = userRoute;
   