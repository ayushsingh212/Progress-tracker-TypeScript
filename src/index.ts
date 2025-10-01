import dotenv from "dotenv";
import { connectDB } from "./dB/dB.connect";
import app from "./app";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT ? Number(process.env.PORT) : 1000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); 
  });
