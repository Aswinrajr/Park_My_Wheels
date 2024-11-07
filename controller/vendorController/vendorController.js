const bcrypt = require("bcrypt");
const vendorModel = require("../../models/venderSchema");
const {uploadImage} = require("../../config/cloudinary")



const vendorSignup = async (req, res) => {
    try {
        const { vendorName, contactPerson, contactNo, location, address, password, confirmPassword } = req.body;

        const imageFile = req.file;

        const uploadedImageUrl = await uploadImage(imageFile.buffer, "vendor_images");

        // Validate required fields
        if (!vendorName || !contactPerson || !contactNo || !location || !address || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Password confirmation check
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save vendor details with image URL in the database
        const newVendor = new Vendor({
            vendorName,
            contactPerson,
            contactNo,
            location,
            address,
            password: hashedPassword,
            image: uploadedImageUrl // Save the image URL
        });

        await newVendor.save();

        return res.status(201).json({
            message: "Vendor registered successfully",
            vendorDetails: {
                vendorName: newVendor.vendorName,
                contactPerson: newVendor.contactPerson,
                contactNo: newVendor.contactNo,
                location: newVendor.location,
                address: newVendor.address,
                image: newVendor.image // Return image URL in response
            }
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
            vendorId: vendor._id,
            vendorName: vendor.vendorName,
            contactPerson: vendor.contactPerson,
            contactNo: vendor.contactNo,
            latitude: vendor.location.lat,
            longitude:vendor.location.lng,
            address: vendor.address,
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
