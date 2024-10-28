const express = require("express");
const userRoute = express();

const userController = require("../../controller/userController/userAuthController");

userRoute.post("/signup", userController.userSignUp);
userRoute.post("/login", userController.userVerification);


module.exports = userRoute;
   