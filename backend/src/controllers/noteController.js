import note from "../models/noteModel.js";
import user from "../models/userModel.js";
import statusCodes from "../config/constants.js";

// add note based on usedId
export const addNote = async (req, res) => {
  try {
    const userId = req.body.userId
    const { title, content } = req.body;
    const findTitle = await note.findOne({ userId, title });

    if (findTitle) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Note Title already exists",
      });
    }

    const response = await note.create({ title, content, userId });

    if (response) {
      res.status(statusCodes.CREATED).json({
        success: true,
        data: response,
        message: "Note Created Success",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: "server error",
      message: error.message,
    });
  }
};

// get all note based on note id

export const getAllNote = async (req, res) => {
  try {
    const notes = await note.find({});

    if (notes) {
      res.status(statusCodes.OK).json({
        success: true,
        message: "Note fetched success",
        data: notes,
      });
    } else {
      res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Note fetch fail",
      });
    }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      data: "Internal server error",
    });
  }
};

// get all notes based on particular userId

export const getParticularUserNote = async (req, res) => {
  try {
    //  checking if desired userId present or note, if present return all the objects that have same userId
    const userId = req.body.userId;

    const currentUserId = await note.find({ userId });

    if (!currentUserId.length) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "User not loggedin",
      });
    }
    const response = currentUserId[0].userId;
    const userVerify = await user.findOne(response);
    const loginStatus = userVerify.isVerified;
    if (loginStatus) {
      if (currentUserId) {
        res.status(statusCodes.OK).json({
          success: true,
          message: "data fetched success",
          data: currentUserId,
        });
      }
    } else {
      res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "User is not Logged In",
      });
    }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Note fetch failed",
    });
  }
};

//get one note based on note id
export const getOneNote = async (req, res) => {
  try {
    const id = req.params.id;
    const particularNote = await note.findById({ _id: id });
    if (particularNote) {
      res.status(statusCodes.OK).json({
        success: true,
        message: "Note fetched success",
        particularNote,
      });
    }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: "server error",
      message: error.message,
    });
  }
};

// update note based on note id

export const updateNote = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.body.userId;
    const { title, content } = req.body;

    const searchNote = await note.findById(id);  // Search for the note to update
    if (!searchNote) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Note not found",
      });
    }

    // If the title is changing, check for duplicates
    if (title && title !== searchNote.title) {
      const findTitle = await note.findOne({ userId, title });
      if (findTitle) {
        return res.status(statusCodes.BAD_REQUEST).json({
          success: false,
          message: "Note Title already exists",
        });
      }
    }

    // Update the note
    searchNote.title = title || searchNote.title;  // Only update if title is provided
    searchNote.content = content || searchNote.content;  // Only update if content is provided

    const updatedNote = await searchNote.save();

    res.status(statusCodes.OK).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: "server error",
      message: "Note update failed",
    });
  }
};


// delete note based on note id
export const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const searchNote = await note.findById(id);
    if (!searchNote) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Note Already deleted",
      });
    }

    const searchUser = searchNote.userId;
    const findUser = await user.findById(searchUser);

    const deleteNote = await note.findByIdAndDelete(id);

    res.status(statusCodes.OK).json({
      success: true,
      message: "Note Deleted Success",
      deleteNote,
    });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Note Delete Failed",
    });
  }
};

// search by title or content but with particular userId

export const search = async (req, res) => {
  try {
    const userId = req.body.userId;

    const { searchText } = req.body;

    if (!userId || !searchText) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "userId and searchText are required.",
      });
    }

    const notes = await note.find({
      userId,
      title: { $regex: searchText, $options: "i" },
    });

    if (notes.length > 0) {
      return res.status(statusCodes.OK).json({
        success: true,
        message: "Notes fetched successfully.",
        notes,
      });
    } else {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "No notes found.",
      });
    }
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// Get paginated notes
export const getPaginatedNotes = async (req, res) => {
  try {
    const userId = req.body.userId;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // 5 notes per page

    // Calculating the skip value
    const skip = (page - 1) * limit;

    // Getting notes with pagination
    const notes = await note.find({ userId }).skip(skip).limit(limit);

    res.status(statusCodes.OK).json({
      success: true,
      message: "Notes fetched as per query",
      data: notes,
    });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      data: "Internal server error",
    });
  }
};

export const sortNotes = async (req, res) => {
  try {
    const userId = req.body.userId;
    const sortCriteria = {
      [req.query.sortField]: req.query.sortOrder === "asc" ? 1 : -1,
    };
    const sortedDocuments = await note.find({ userId }).sort(sortCriteria);
    return res.status(statusCodes.OK).json({
      success: true,
      sortedDocuments,
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// search,sort,pagination all in one

export const searchSortPaginateNotes = async (req, res) => {
  try {
    const { userId, role, searchText } = req.body;
    const { sortField = "title", sortOrder = "asc", page = 1, limit = 5 } = req.query;

    if (!userId) {
      return res.status(statusCodes.BAD_REQUEST).json({ success: false, message: "userId is required." });
    }

    const filter = {};

    if (role === "user") {
      filter.userId = userId; // user can only see their own note
      if (searchText) {
        filter.title = { $regex: searchText, $options: "i" }; 
      }
    } else {
      if (searchText) {
        filter.$or = [
          { title: { $regex: searchText, $options: "i" } },
          { "userId.userName": { $regex: searchText, $options: "i" } }, 
        ];
      }
    }

    const skip = (page - 1) * limit;

    const notes = await note.find(filter)
      .populate("userId", "userName") // Populate userName
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalNotes = await note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / limit);

    return res.status(statusCodes.OK).json({
      success: true,
      message: "Notes fetched successfully.",
      notes,
      pagination: { totalNotes, currentPage: page, totalPages, limit },
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};





