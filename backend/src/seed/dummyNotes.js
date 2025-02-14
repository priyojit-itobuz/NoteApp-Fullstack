import { faker } from '@faker-js/faker'
import user from '../models/userModel.js'; 
import note from '../models/noteModel.js'

const dummyNotes = async (num) => {
  const notes = [];

  const allUsers = await user.find();
  for (let i = 1; i <= num; i++) {
    const title = faker.person.jobTitle();
    const content = faker.lorem.sentences(1);
    const pic = "";

    let random = Math.floor(Math.random() * allUsers.length)
    const userId = allUsers[random]._id;


    notes.push({
      title,
      content,
      userId,
      pic,
    });
  }
  try{
     await note.insertMany(notes)
  }
  catch(error){
     console.log(error)
  }
};

export default dummyNotes