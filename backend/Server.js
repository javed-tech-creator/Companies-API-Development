import express from "express"
import { dbConnection } from "./config/dbConnection.js"
import dotenv from "dotenv"
import cors from "cors"
import companyRouter from "./router/company.router.js"
dotenv.config();

const server = express();
const PORT = process.env.PORT;

// middleware 
server.use(express.json());
app.use(express.urlencoded({ extended: true }));
server.use(cors());

// database connection 
await dbConnection();

// route
server.use('/company-api',companyRouter)


// server start 
server.listen(PORT,()=>{
  console.log(`Your Server is Running on  ${PORT}`);
  
})