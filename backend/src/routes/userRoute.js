import express from "express"
import { login,logout,regenerateAccessToken,register} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validate } from "../middlewares/validateData.js";
import { signupUser, loginUser } from "../validators/dataValidation.js";
import { isLoggedIn } from "../middlewares/loginStatus.js";

const route = express.Router();

route.post("/register",validate(signupUser),register);
route.post("/login",validate(loginUser),login)
route.get("/getAccessToken",regenerateAccessToken)
route.post("/verify/:token",verifyToken)
route.post("/logout",isLoggedIn,logout)



export default route;
