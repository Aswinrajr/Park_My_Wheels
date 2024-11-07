const express = require("express");
const multer = require("multer");
const vendorRoute = express();

const vendorController = require("../../controller/vendorController/vendorController")


vendorRoute.post("/signup", vendorController.vendorSignup);
vendorRoute.post("/login", vendorController.vendorLogin);








module.exports = vendorRoute;
