import express from "express";
import multer from "multer";
import path from "path";
import Portfolio from "../models/portfolioModel.js";

const router = express.Router();

// Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ GET portfolio
router.get("/", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({});
    if (!portfolio) {
      return res.status(404).json({ message: "No portfolio found yet" });
    }
    res.json(portfolio);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

// ✅ POST create/update portfolio
router.post(
  "/",
  upload.fields([
    { name: "aboutPic", maxCount: 1 },
    { name: "profilePic", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const formData = JSON.parse(req.body.header);
      formData.skills = JSON.parse(req.body.skills);
      formData.skills1 = JSON.parse(req.body.skills1);
      formData.skills2 = JSON.parse(req.body.skills2);
      formData.education = JSON.parse(req.body.education);
      formData.experiences = JSON.parse(req.body.experiences);
      formData.projects = JSON.parse(req.body.projects);

      if (req.files?.aboutPic) {
        formData.aboutPic = `/uploads/${req.files.aboutPic[0].filename}`;
      }
      if (req.files?.profilePic) {
        formData.projects[0].profilePic = `/uploads/${req.files.profilePic[0].filename}`;
      }

      // update or create one document
      const portfolio = await Portfolio.findOneAndUpdate({}, formData, {
        new: true,
        upsert: true
      });

      res.json({ message: "Portfolio saved successfully", portfolio });
    } catch (err) {
      console.error("POST Error:", err);
      res.status(500).json({ error: "Failed to save portfolio" });
    }
  }
);

export default router;
