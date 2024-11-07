const bcrypt = require("bcrypt");
const vendorModel = require("../../models/venderSchema");



const vendorSignup = async (req, res) => {
  try {
    console.log("Welcome to vendor sign up", req.body);

    const {
      vendorName,
      contactPerson,
      mobile,
      location,
      address,
      password,
      confirmPassword,
    } = req.body;

    if (
      !vendorName ||
      !contactPerson ||
      !mobile ||
      !location ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    const existingVendor = await vendorModel.findOne({ contactNo:mobile });
    if (existingVendor) {
      return res
        .status(409)
        .json({
          message: "Vendor already registered with this contact number",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new vendorModel({
      vendorName,
      contactPerson,
      contactNo:mobile,
      location,
      address,
      password: hashedPassword,
    });

    await newVendor.save();

    return res.status(201).json({
      message: "Vendor registration successful",
      vendorId: newVendor._id,
    });
  } catch (err) {
    console.error("Error in vendor sign up", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const vendorLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body;

      
        if (!mobile || !password) {
            return res.status(400).json({ message: "Mobile number and password are required" });
        }

 
        const vendor = await vendorModel.findOne({ contactNo:mobile });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

   
        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }

       
        return res.status(200).json({
            message: "Login successful",
            vendorDetails: {
                vendorId: vendor._id,
                vendorName: vendor.vendorName,
                contactPerson: vendor.contactPerson,
                contactNo: vendor.contactNo,
                location: vendor.location,
                address: vendor.address,
            }
        });
    } catch (err) {
        console.error("Error in vendor login", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
  vendorSignup,
  vendorLogin
};
