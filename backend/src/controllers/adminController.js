import note from "../models/noteModel.js";
import user from "../models/userModel.js";

//fetching all users
export const getAllUser = async (req, res) => {
  try {
    const users = await user.find({ role: "user" });
    console.log(users);

    if (users) {
      res.status(200).json({
        success: true,
        message: "User fetched success",
        data: users,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User fetch fail",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//fetch notes based on userId
export const getParticularUserNote = async (req, res) => {
  try {
    const userId = req.params.id;

    const currentUserId = await note.find({ userId });
    console.log("userrrr", currentUserId);

    if (!currentUserId.length) {
      return res.status(400).json({
        success: false,
        message: "No Notes to Fetch",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Notes fetched success",
        data: currentUserId,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.body.userId;

    const { title, content } = req.body;
    const findTitle = await note.findOne({ userId, title });
    if (findTitle) {
      return res.status(400).json({
        success: false,
        message: "Note Title already exists",
      });
    }

    const searchNote = await note.findById(id);
    const searchUser = searchNote.userId;
    const findUser = await user.findById(searchUser);

    const updatedNote = await note.findByIdAndUpdate(
      { _id: id },
      { title, content }
    );
    res.status(200).json({
      success: true,
      message: "Note updated Success",
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: "server error",
      message: error.message,
    });
  }
};

// delete note based on note id
export const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const searchNote = await note.findById(id);
    if (!searchNote) {
      return res.status(404).json({
        success: false,
        message: "Note Already deleted",
      });
    }

    const searchUser = searchNote.userId;
    const findUser = await user.findById(searchUser);

    const deleteNote = await note.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Note Deleted Success",
      deleteNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// admin add Note
export const addNoteAdmin = async(req,res) => {
  try {
    const userId = req.params.id;
    const { title, content } = req.body;
    const findTitle = await note.findOne({ userId, title });
    if (findTitle) {
      return res.status(400).json({
        success: false,
        message: "Note Title already exists",
      });
    }

    const response = await note.create({ title, content, userId });

    if (response) {
      res.status(200).json({
        success: true,
        data: response,
        message: "Note Created Success",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      data: "server error",
      message: error.message,
    });
  }
}

export const deleteAllNotes = async(req,res) => {
  try {
    const userId = req.params.id;
    const findNotes = await note.find({userId}); 
    if(findNotes.length === 0)
    {
      return res.status(404).json({
        success : false,
        message : "No Notes Left to Delete"
       })
    }
    else
    {
       const deleteAll = await note.deleteMany({userId})
       return res.status(200).json({
        success : true,
        message : "All Notes Deleted"
       })
    }

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success : false,
      message : error.message
    })
    
  }
}

export const deleteUser = async(req,res) => {
  try {
    const id = req.params.id;
    console.log(id);
    
    const findUser = await user.find({_id:id});
    console.log("myuSER",findUser);
    if(findUser)
    {
      await note.deleteMany({userId:id})
      await user.deleteOne({_id:id});
      return res.status(200).json({
        success : true,
        message : "User deleted Success"
      })
    }
    else
    {
      return res.status(404).json({
        success : false,
        message : "No user to Delete"
      })
    }

  } catch (error) {
    console.log("error");
    return res.status(500).json({
      success : false,
      message : error.message
    })
    
  }
}