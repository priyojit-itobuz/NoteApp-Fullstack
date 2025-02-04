import express from "express";
import dbConnect from "./src/config/dbConnection.js";
import dotenv from "dotenv/config";
import route from "./src/routes/userRoute.js";
import routes from "./src/routes/noteRoute.js";
import fs from "fs";
import cors from "cors";

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}


const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT;

const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.use("/", route);
app.use("/note", routes);

// to use static files (uploads is my folder which has static files)
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server up at ${PORT}`);
});

dbConnect();
