import session from "../models/sessionModel.js";
import user from "../models/userModel.js";
import jwt from "jsonwebtoken";
import statusCodes from "../config/constants.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
  
    if(authHeader && authHeader.startsWith("Bearer"))
    {
      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) 
      {
        return res.status(statusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
      }
  
    jwt.verify(accessToken,process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        res.status(statusCodes.UNAUTHORIZED).json({ success : false,
          message: "Access Token expired" });
      } else 
      {
        const id = decoded.userId;
        if(!req.body.userId)
        {
          req.body.userId  =  id;
        }
        const role = decoded.role
        req.body.role = role;
        const userVerify = await user.findById(id);
        const resp = await session.findOne({userId : id});
        
        if (!userVerify.isVerified || !accessToken || !resp) {
          return res.status(statusCodes.FORBIDDEN).json({
            success: false,
            message: "User is not logged in or not verified or AccessToken missing or session expired",
          });
        }
    
        // Proceed to the next middleware if user is verified
        next();
      }
    });
  }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error.",
    });
  }
};
