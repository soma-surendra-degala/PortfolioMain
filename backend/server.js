import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import portfolioRoutes from "./routes/portfolioRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// routes
app.use("/", portfolioRoutes);

// connect Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
);
