import mongoose from "mongoose";

const dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Successful Database connection");
    })
    .catch((error) => {
        console.log("Retry Connection");
        console.error(error.message);
    })
} 

export default dbConnect;