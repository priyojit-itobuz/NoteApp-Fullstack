import express from "express"
import { isLoggedIn } from "../middlewares/loginStatus.js";
import { addNoteAdmin, deleteNote, getAllUser, getParticularUserNote, updateNote } from "../controllers/adminController.js";


const route = express.Router();

route.post("/addNote/:id",isLoggedIn,addNoteAdmin)
route.get("/allUser",isLoggedIn,getAllUser)
route.get("/particularNote/:id",isLoggedIn,getParticularUserNote)
route.put("/updateNote/:id",isLoggedIn,updateNote)
route.delete("/deleteNote/:id",isLoggedIn,deleteNote)

export default route;