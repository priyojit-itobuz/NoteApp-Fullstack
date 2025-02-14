import jwt from "jsonwebtoken";
import user from "../models/userModel.js";
import statusCodes from "../config/constants.js";

export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(statusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        return res.status(statusCodes.UNAUTHORIZED).json({ error: "Verification failed. The link may be invalid or expired." });
      }

      const id = decoded.userId;
      const findUser = await user.findById(id);

      if (findUser) {
        if (findUser.isVerified) {
          return res.status(statusCodes.OK).json({ success: true, message: "Email already verified!" });
        }

        findUser.isVerified = true;
        await findUser.save();

        return res.status(statusCodes.OK).json({ success: true, message: "Email verified successfully!" });
      } else {
        return res.status(statusCodes.SERVICE_UNAVAILABLE).json({ success: false, message: "User not found. Please register again." });
      }
    });
  }
};
