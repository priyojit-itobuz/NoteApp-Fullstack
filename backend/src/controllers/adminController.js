import note from "../models/noteModel.js";
import session from "../models/sessionModel.js";
import user from "../models/userModel.js";
import statusCodes from "../config/constants.js";

//fetching all users
export const getAllUser = async (req, res) => {
  try {
    const users = await user.find({ role: "user" });

    if (users) {
      res.status(statusCodes.OK).json({
        success: true,
        message: "User fetched success",
        data: users,
      });
    } else {
      res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "User fetch fail",
      });
    }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteUser = async(req,res) => {
  try {
    const id = req.params.id;
    
    const findUser = await user.find({_id:id});
    if(findUser)
    {
      await note.deleteMany({userId:id})
      await session.deleteMany({userId : id})
      await user.deleteOne({_id:id});
      return res.status(statusCodes.OK).json({
        success : true,
        message : "User deleted Success"
      })
    }
    else
    {
      return res.status(statusCodes.NOT_FOUND).json({
        success : false,
        message : "No user to Delete"
      })
    }

  } catch (error) {
    console.log("error");
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success : false,
      message : error.message
    })
    
  }
}