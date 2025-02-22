import user from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { mailSender } from "../EmailVerify/mailSender.js";
import session from "../models/sessionModel.js";
import statusCodes from "../config/constants.js";

//SignUp or Register User
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await user.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // If the user exists but is not verified, resend verification email with the same userId
        const token = jwt.sign(
          { userId: existingUser._id },
          process.env.SECRET_KEY,
          {
            expiresIn: "10m",
          }
        );

        try {
          await mailSender(email, token);
        } catch (error) {
          return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
          });
        }

        return res.status(statusCodes.OK).json({
          success: true,
          message:
            "User already exists but not verified. Verification email sent again.",
        });
      } else {
        // If the user exists and is verified, prevent duplicate registration
        return res
          .status(statusCodes.BAD_REQUEST)
          .json({
            error: "User is already registered and verified. Please log in.",
          });
      }
    }

    // If the email doesn't exist, create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      userName,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    try {
      await mailSender(email, token);
    } catch (error) {
      return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }

    res.status(statusCodes.CREATED).json({
      success: true,
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


//login
export const login = async (req, res) => {
  try {
    // Check if the email exists
    const { password } = req.body;
    const currentUser = await user
      .findOne(
        { email: req.body.email },
        { password: 1, email: 1, userName: 1, role: 1, _id:1 }
      )
      .exec();
    if (!currentUser) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ message: "Invalid Credentials" });
    }
    const userName = currentUser.userName;
    const email = currentUser.email;
    const role = currentUser.role;
    const uid = currentUser._id;
    if (currentUser.isVerified === false) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User not Verified",
      });
    }

    const userId = currentUser._id;

    const passwordMatch = await bcrypt.compare(password, currentUser.password);
    if (!passwordMatch) {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({ userId, role }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId, role }, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    const response = await session.create({ userId });

    res.status(statusCodes.OK).json({
      success: true,
      message: "Logged In",
      accessToken,
      refreshToken,
      userName,
      role,
      email,
      uid,
    });
  } catch (error) {
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};


//Regenerating refresh nd access Token
export const regenerateAccessToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader.split(" ")[1];

  if (!refreshToken) {
    return res.status(statusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  jwt.verify(refreshToken, process.env.SECRET_KEY, async (error, decoded) => {
    if (error) {
      res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Error in refreshToken or expired, Login Again",
      });
    } else {
      const userId = decoded.userId;
      req.body.userId = userId;
      const role = decoded.role;
      req.body.role = role;
      const userVerify = await user.findById(userId);
      const accessToken = jwt.sign({ userId, role }, process.env.SECRET_KEY, {
        expiresIn: "15m",
      });
      return res.status(statusCodes.OK).json({
        success: true,
        accessToken,
      });
    }
  });
};

//logout

export const logout = async (req, res) => {
  // delete session based on particular user
  try {
    const id = req.body.userId;
    const searchUser = await user.findById(id);

    const deleteSession = await session.deleteMany({ userId: id });

    if (searchUser && searchUser.isVerified === true) {
      res.status(statusCodes.OK).json({
        success: true,
        message: "User logout success",
      });
    } else {
      res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "User is not logged In, Login first",
      });
    }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// Change User Name
export const changeUserName = async (req, res) => {
  try {
    const { userName } = req.body;
    const id = req.body.userId;
    const searchUser = await user.findById(id);
    if (searchUser) {
      searchUser.userName = userName;
      await searchUser.save();
      res.status(statusCodes.OK).json({
        success: true,
        message: searchUser,
      });
    } else {
      res.status(statusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Error in Updating Username",
      });
    }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

//Profile Pic Upload
export const uploadUserProfilePic = async (req, res) => {
  try {
    const id = req.body.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const searchUser = await user.findById(id);
    if (searchUser) {
      searchUser.profilePic =
        "http://localhost:3000/uploads/" + req.file.filename;
      await searchUser.save();
      return res.status(statusCodes.OK).json({
        success: true,
        message: `Profile Picture uploaded successfully: ${req.file.filename}`,
        data: req.file.filename,
      });
    } else {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Profile Picture upload Failed",
      });
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all User
export const getUser = async (req, res) => {
  try {
    const id = req.body.userId;
    const searchUser = await user.findById(id);
    if (searchUser) {
      return res.status(statusCodes.OK).json({
        success: true,
        message: "User Fetched Success",
        searchUser,
      });
    } else {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Failed to Fetch User",
      });
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
