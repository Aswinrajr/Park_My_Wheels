const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");

const getUserData = async (req, res) => {
  try {
    console.log("Welcome to getting the user data", req.query);

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userData = await userModel.findOne({ _id: id },{userPassword:0});

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

        const { id } = req.query;
        const updates = req.body; 

        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required in query parameters",
            });
        }


        if (!updates || typeof updates !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Updates object is required in the request body",
            });
        }

    
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
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







module.exports = {
    getUserData,
    updateUserData
    
};
