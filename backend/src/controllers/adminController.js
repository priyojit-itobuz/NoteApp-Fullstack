import note from "../models/noteModel.js";
import user from "../models/userModel.js";

//fetching all users
export const getAllUser = async (req, res) => {
  try {
    const users = await user.find({ role: "user" });

    if (users) {
      res.status(200).json({
        success: true,
        message: "User fetched success",
        data: users,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User fetch fail",
      });
    }
  } catch (error) {
    res.status(500).json({
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
      await user.deleteOne({_id:id});
      return res.status(200).json({
        success : true,
        message : "User deleted Success"
      })
    }
    else
    {
      return res.status(404).json({
        success : false,
        message : "No user to Delete"
      })
    }

  } catch (error) {
    console.log("error");
    return res.status(500).json({
      success : false,
      message : error.message
    })
    
  }
}