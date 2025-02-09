import jwt from "jsonwebtoken";
import user from "../models/userModel.js";

export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: "Verification failed. The link may be invalid or expired." });
      }

      const id = decoded.userId;
      const findUser = await user.findById(id);

      if (findUser) {
        if (findUser.isVerified) {
          return res.status(200).json({ success: true, message: "Email already verified!" });
        }

        findUser.isVerified = true;
        await findUser.save();

        return res.status(200).json({ success: true, message: "Email verified successfully!" });
      } else {
        return res.status(404).json({ success: false, message: "User not found. Please register again." });
      }
    });
  }
};
