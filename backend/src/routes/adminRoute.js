import express from "express"
import { isLoggedIn } from "../middlewares/loginStatus.js";
import { deleteUser, getAllAdmins, getAllUser } from "../controllers/adminController.js";

const route = express.Router();

route.get("/allUser",isLoggedIn,getAllUser)
route.delete("/deleteUser/:id",isLoggedIn,deleteUser);
route.get("/allAdmins",isLoggedIn,getAllAdmins);

export default route;