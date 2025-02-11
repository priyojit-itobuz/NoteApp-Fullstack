import express from "express"
import { changeUserName, getUser, login,logout,regenerateAccessToken,register, uploadUserProfilePic} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validate } from "../middlewares/validateData.js";
import { signupUser, loginUser } from "../validators/dataValidation.js";
import { isLoggedIn } from "../middlewares/loginStatus.js";
import { upload } from "../controllers/fileController.js";

const route = express.Router();

route.post("/register",validate(signupUser),register);
route.post("/login",validate(loginUser),login)
route.get("/getAccessToken",regenerateAccessToken)
route.post("/verify/:token",verifyToken)
route.post("/logout",isLoggedIn,logout)
route.post("/changeUserName",isLoggedIn,changeUserName)
route.post("/changeProfilePic",upload.single("profilePic"),isLoggedIn,uploadUserProfilePic)
route.get("/getUser",isLoggedIn,getUser);


export default route;
