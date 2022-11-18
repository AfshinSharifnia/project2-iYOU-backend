import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await mongoose.connect(
    process.env.MONGODB_URI,

    {
      dbName: process.env.MONGODB_DBNAME,

      user: process.env.MONGODB_USER,

      pass: process.env.MONGODB_PASSWORD,
    },
  );
}
console.log("Connected to MongoDB"), main().catch((err) => console.log(err));

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
