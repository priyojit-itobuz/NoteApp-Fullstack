import user from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { mailSender } from "../EmailVerify/mailSender.js";
import session from "../models/sessionModel.js";



//SignUp or Register User

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await user.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // If the user exists but is not verified, resend verification email with the same userId
        const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY, {
          expiresIn: "10m",
        });

        await mailSender(email, token);

        return res.status(200).json({
          success: true,
          message: "User already exists but not verified. Verification email sent again.",
        });
      } else {
        // If the user exists and is verified, prevent duplicate registration
        return res.status(400).json({ error: "User is already registered and verified. Please log in." });
      }
    }

    // If the email doesn't exist, create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      userName,
      email,
      password: hashedPassword,
      isVerified: false, // Ensure verification is required
    });

    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    await mailSender(email, token);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Verification email sent.",
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



//login
export const login = async (req, res) => {
  try {
    // Check if the email exists
    const currentUser = await user.findOne({ email: req.body.email });
    console.log("my user",currentUser);
    const userName = currentUser.userName;
    const email = currentUser.email
    
    const userId = currentUser._id;
    
    if (!currentUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      currentUser.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const accessToken = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    const response = await session.create({userId });

    res.status(200).json({
      success: true,
      message: "Logged In",
      accessToken,
      refreshToken,
      userName,
      email
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const regenerateAccessToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(refreshToken,process.env.SECRET_KEY, async (error, decoded) => {
    if (error) {
      res.status(400).json({
        success : false,
        message : "Error in refreshToken or expired, Login Again"
      })
    }
    else 
    {
      const userId = decoded.userId;
      req.body.userId  =  userId;
      const userVerify = await user.findById(userId);
      const accessToken = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: "15m",
      });
      return res.status(200).json({
        success : true,
        accessToken
      })      
    }
  });

};

export const logout = async (req, res) => {
  // delete session based on particular user
  try {
    const id = req.body.userId;
    const searchUser = await user.findById(id);
    
    const deleteSession = await session.deleteMany({userId : id})
    
    if (searchUser && searchUser.isVerified === true) {
      // searchUser.isVerified = false;
      // searchUser.save();
      res.status(200).json({
        success: true,
        message: "User logout success",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User is not logged In, Login first",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const changeUserName = async(req,res) => {
  try{
    const {userName} = req.body;
    const id = req.body.userId;
    const searchUser = await user.findById(id);
    if(searchUser)
    {
      console.log("my user",searchUser);  
      searchUser.userName = userName;
      await searchUser.save();
      res.status(200).json({
        success : true,
        message : searchUser
      })  
    }
    else
    {
      res.status(401).json({
        success : false,
        message : "Error in Updating Username"
      })
    }
  }
  catch(error)
  {
    console.log(error.message);
    res.status(500).json({
      success : false,
      message: "Internal Server Error"
    })
  }
}