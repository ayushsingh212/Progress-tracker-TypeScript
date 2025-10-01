import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    const connect = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );

    console.log(
      "The database has been connected successfully:",
      connect.connection.host
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export { connectDB };
