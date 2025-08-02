import express from "express";
import multer from "multer";
import path from "path";
import Portfolio from "../models/portfolioModel.js";
import defaultPortfolio from "../defaultPortfolio.js";

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


// ✅ GET portfolio with full fallback
router.get("/", async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({});

    if (!portfolio) {
      // No data → insert defaults
      portfolio = await Portfolio.create(defaultPortfolio);
      console.log("🌱 Default portfolio inserted!");
      return res.json(portfolio);
    }

    const dbData = portfolio.toObject();

    // Start with defaults
    const merged = { ...defaultPortfolio };

    // Go through each key
    for (let key in defaultPortfolio) {
      const value = dbData[key];

      if (
        value === undefined || 
        value === null || 
        value === "" || 
        (Array.isArray(value) && value.length === 0)
      ) {
        // Use default if empty
        merged[key] = defaultPortfolio[key];
      } else {
        // Merge arrays and objects properly
        if (Array.isArray(value)) {
          merged[key] = value.length > 0 ? value : defaultPortfolio[key];
        } else if (typeof value === "object" && !Array.isArray(value)) {
          merged[key] = { ...defaultPortfolio[key], ...value };
        } else {
          merged[key] = value;
        }
      }
    }

    res.json(merged);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});


// ✅ POST create/update portfolio
router.post("/", upload.any(), async (req, res) => {
  try {
    let formData = JSON.parse(req.body.header);
    formData.skills = JSON.parse(req.body.skills);
    formData.skills1 = JSON.parse(req.body.skills1);
    formData.skills2 = JSON.parse(req.body.skills2);
    formData.education = JSON.parse(req.body.education);
    formData.experiences = JSON.parse(req.body.experiences);
    formData.projects = JSON.parse(req.body.projects);

    // Attach uploaded files
    req.files.forEach((file) => {
      if (file.fieldname === "aboutPic") formData.aboutPic = `/uploads/${file.filename}`;
      if (file.fieldname === "profilePic") formData.profilePic = `/uploads/${file.filename}`;
      if (file.fieldname.startsWith("projects")) {
        const indexMatch = file.fieldname.match(/projects\[(\d+)\]\[screenshot\]/);
        if (indexMatch) {
          const index = parseInt(indexMatch[1], 10);
          if (formData.projects[index]) {
            formData.projects[index].screenshot = `/uploads/${file.filename}`;
          }
        }
      }
      if (file.fieldname === "resume") formData.resume = `/uploads/${file.filename}`;
    });

    // Clear missing images
    if (!formData.aboutPic) formData.aboutPic = "";
    if (!formData.profilePic) formData.profilePic = "";
    if (!formData.resume) formData.resume = "";
    formData.projects.forEach((project) => {
      if (!project.screenshot) project.screenshot = "";
    });

    // Update MongoDB
    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { ...formData },
      { new: true, upsert: true }
    );

    res.json({ message: "Portfolio saved successfully", portfolio });
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({ error: "Failed to save portfolio" });
  }
});

export default router;
