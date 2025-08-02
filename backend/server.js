import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import Portfolio from "./models/portfolioModel.js";
import defaultPortfolio from "./defaultPortfolio.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/", portfolioRoutes);

// Connect Mongo and seed default data
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ MongoDB Connected");

    const count = await Portfolio.countDocuments();
    if (count === 0) {
      await Portfolio.create(defaultPortfolio);
      console.log("🌱 Default portfolio inserted");
    }

    app.listen(process.env.PORT || 5000, () => console.log("🚀 Server running"));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
