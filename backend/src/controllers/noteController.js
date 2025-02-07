import note from "../models/noteModel.js";
import user from "../models/userModel.js";

// add note based on usedId
export const addNote = async (req, res) => {
  try {
    const userId = req.body.userId;
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
};

// get all note based on note id

export const getAllNote = async (req, res) => {
  try {
    const notes = await note.find({});
    if (notes) {
      res.status(200).json({
        success: true,
        message: "Note fetched success",
        data: notes,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Note fetch fail",
      });
    }
  } catch (error) {
    res.status(500).json({
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
      return res.status(400).json({
        success: false,
        message: "User not loggedin",
      });
    }
    const response = currentUserId[0].userId;
    const userVerify = await user.findOne(response);
    const loginStatus = userVerify.isVerified;
    if (loginStatus) {
      if (currentUserId) {
        res.status(200).json({
          success: true,
          message: "data fetched success",
          data: currentUserId,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "User is not Logged In",
      });
    }
  } catch (error) {
    res.status(500).json({
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
      res.status(200).json({
        success: true,
        message: "Note fetched success",
        particularNote,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: "server error",
      message: "User cant be fetched",
    });
  }
};

// update note based on note id

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
      return res.status(400).json({
        success: false,
        message: "userId and searchText are required.",
      });
    }

    const notes = await note.find({
      userId,
      title: { $regex: searchText, $options: "i" },
    });

    if (notes.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Notes fetched successfully.",
        notes,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No notes found.",
      });
    }
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      message: "Notes fetched as per query",
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
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
    return res.status(200).json({
      success: true,
      sortedDocuments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// search,sort,pagination all in one

export const searchSortPaginateNotes = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { searchText } = req.body;
    const sortField = req.query.sortField || "title";  // Default sort field
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;  // Default to descending
    const page = parseInt(req.query.page) || 1;  // Default page = 1
    const limit = parseInt(req.query.limit) || 5;  // Default limit = 10

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }

    // Create filter for search
    const filter = { userId };
    if (searchText) {
      filter.title = { $regex: searchText, $options: "i" };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch notes with search, sorting, and pagination
    const notes = await note.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalNotes = await note.countDocuments(filter);  // Total notes for pagination info

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully.",
      notes,
      pagination: {
        totalNotes,
        currentPage: page,
        totalPages: Math.ceil(totalNotes / limit),
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
