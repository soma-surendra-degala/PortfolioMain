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
const upload = multer({
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10 MB per field
    fileSize: 10 * 1024 * 1024   // 10 MB per file
  }
});


// ✅ GET portfolio
router.get("/",async (req, res) => {
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
  upload.any(), 
  async (req, res) => {
    try {
      const formData = JSON.parse(req.body.header);
      formData.skills = JSON.parse(req.body.skills);
      formData.skills1 = JSON.parse(req.body.skills1);
      formData.skills2 = JSON.parse(req.body.skills2);
      formData.education = JSON.parse(req.body.education);
      formData.experiences = JSON.parse(req.body.experiences);
      formData.projects = JSON.parse(req.body.projects);
      req.files.forEach(file => {
        if (file.fieldname === "aboutPic") {
          formData.aboutPic = `/uploads/${file.filename}`;
        }
        if (file.fieldname === "profilePic") {
          // assuming only first project gets profilePic
          if (formData.projects.length > 0) {
            formData.projects[0].profilePic = `/uploads/${file.filename}`;
          }
        }
        if (file.fieldname.startsWith("projects")) {
          // e.g., projects[0][screenshot]
          const indexMatch = file.fieldname.match(/projects\[(\d+)\]\[screenshot\]/);
          if (indexMatch) {
            const index = parseInt(indexMatch[1], 10);
            if (formData.projects[index]) {
              formData.projects[index].screenshot = `/uploads/${file.filename}`;
            }
          }
        }
        if (file.fieldname === "resume") {
          formData.resume = `/uploads/${file.filename}`;
        }
      });

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
