import mongoose from "mongoose";

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/posada-app";

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log("✅ Connected to the database");
    })
    .catch(() => {
      console.log("❌ Something went wrong when connecting to the database");
    });
}
