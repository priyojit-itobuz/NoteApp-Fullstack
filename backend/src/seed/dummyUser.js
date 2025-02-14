import { faker } from '@faker-js/faker'
import user from '../models/userModel.js'; 
import bcrypt from "bcryptjs";

const dummyUser = async (num) => {
  const users = [];

  for (let i = 1; i <= num; i++) {
    const userName = faker.person.firstName();
    let password = "11111111";
    const email = `priyojit+${i}@itobuz.com`;
    const isVerified = true;

    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword

    users.push({
      userName,
      password,
      email,
      isVerified,
    });
  }
  try{
     await user.insertMany(users)
  }
  catch(error){
     console.log(error)
  }
};

export default dummyUser