import multer from "multer";
import path from "path";
import note from "../models/noteModel.js";
import statusCodes from "../config/constants.js";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
});

export const uploadNotes = async (req, res) => {
  try {
    const id = req.params.id;

  if (!req.file) {
    return res.status(statusCodes.BAD_REQUEST).json({ message: "No file uploaded." });
  }
  const Note = await note.findById(id);
  if (Note) {
    Note.pic = "http://localhost:3000/uploads/" + req.file.filename;
    await Note.save();
    return res.status(statusCodes.OK).json({
      success: true,
      message: `File uploaded successfully: ${req.file.filename}`,
      data: req.file.filename,
    });
  } 
  else {
    return res.status(statusCodes.NOT_FOUND).json({
      success : false,
      message : "Note not Found"
    })
  }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


