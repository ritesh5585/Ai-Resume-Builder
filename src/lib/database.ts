import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in .env file");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
