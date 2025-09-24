import mongoose from "mongoose";

 export const dbConnection = async () =>{ 
  const url = process.env.MONGO_URL;
  try{
  await mongoose.connect(url)
    console.log("DB Connected Successfully :-");  
  }catch (error){
console.log(error);
  }
  }