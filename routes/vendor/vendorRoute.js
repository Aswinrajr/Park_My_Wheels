const express = require("express");
const multer = require("multer");
const vendorRoute = express.Router();
const vendorController = require("../../controller/vendorController/vendorController");

// Multer setup to handle image uploads
const storage = multer.memoryStorage(); // Store the image in memory temporarily
const upload = multer({ storage: storage });

// Routes
vendorRoute.post("/signup", upload.single("image"), vendorController.vendorSignup);
vendorRoute.post("/login", vendorController.vendorLogin);

module.exports = vendorRoute;
