const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");



const userSignUp = async (req, res) => {
  try {
    console.log("Welcome to user sugnup",req.body)
    const { userName, userMobile,userEmail,userPassword} = req.body;
   
    const mobile = parseInt(userMobile);

    const existUser = await userModel.findOne({ userEmail });
    if (!existUser) {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      
      const userData = {
        userName,
        userEmail,
        userMobile: mobile,
        userPassword: hashedPassword,
       
      };

      const newUser = new userModel(userData);
      await newUser.save();

      res.status(201).json({ message: "User registered successfully.", userData: newUser });
    } else {
      res.status(400).json({ message: "User already registered." });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error." });
  }
};

const userVerification = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const userData = await userModel.findOne({ userMobile:mobile });

    if (userData) {
      const isPasswordValid = await bcrypt.compare(password, userData.userPassword);
      
      if (isPasswordValid) {
        const role = userData.role === "user" ? "user" : "admin";
        return res.status(200).json({
          message: "Login successful.",
          user: userData._id,
          role: role,
        });
      } else {
        return res.status(401).json({ message: "Entered password is incorrect." });
      }
    } else {
      return res.status(404).json({ message: "User is not registered, please sign up." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  userSignUp,
  userVerification,
};
