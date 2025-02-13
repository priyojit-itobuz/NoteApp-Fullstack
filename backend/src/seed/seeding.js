import dbConnect from '../config/dbConnection.js';
import user from '../models/userModel.js';
import note from '../models/noteModel.js';
import session from '../models/sessionModel.js';
import dummyUser from '../seed/dummyUser.js';
import mongoose from 'mongoose';
import dummyNotes from './dummyNotes.js';


async function reset () {
    dbConnect();
    await note.deleteMany();
    await user.deleteMany();
    await session.deleteMany();
    console.log('Database reset');
}

async function createDummy() {
    await dummyUser(5)
    await dummyNotes(5)
    mongoose.connection.close()
}

await reset()
createDummy()