import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Portfolio from "../models/portfolioModel.js";
import defaultPortfolio from "../defaultPortfolio.js";

const router = express.Router();

// ---------------- Multer Storage Config ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Helper: delete old file
const deleteOldFile = (filePath) => {
  if (filePath && filePath.startsWith("/uploads/")) {
    const localPath = path.join(process.cwd(), filePath);
    fs.unlink(localPath, (err) => {
      if (err) console.warn("⚠️ Could not delete old file:", localPath);
      else console.log("🗑️ Deleted old file:", localPath);
    });
  }
};

// ---------------- GET Full Portfolio ----------------
router.get("/", async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({});
    if (!portfolio) {
      portfolio = await Portfolio.create(defaultPortfolio);
      console.log("🌱 Default portfolio inserted!");
    }
    res.json(portfolio);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

// ---------------- POST Create/Update Full Home Portfolio ----------------
router.post("/", upload.any(), async (req, res) => {
  try {
    let formData = req.body;

    // Parse JSON fields from FormData
    ["header", "about", "skills", "skills1", "skills2", "education", "experiences", "projects"].forEach(
      (field) => {
        if (formData[field] && typeof formData[field] === "string") {
          formData[field] = JSON.parse(formData[field]);
        }
      }
    );

    // Fetch current portfolio for file cleanup
    const existingPortfolio = await Portfolio.findOne({});

    // File Handling
    req.files.forEach((file) => {
      if (file.fieldname === "profilePic") {
        // delete old profilePic
        if (existingPortfolio?.header?.profilePic) {
          deleteOldFile(existingPortfolio.header.profilePic);
        }
        formData.header.profilePic = `/uploads/${file.filename}`;
      }
      if (file.fieldname === "resume") {
        if (existingPortfolio?.header?.resume) {
          deleteOldFile(existingPortfolio.header.resume);
        }
        formData.header.resume = `/uploads/${file.filename}`;
      }
      if (file.fieldname === "aboutPic") {
        if (existingPortfolio?.about?.aboutPic) {
          deleteOldFile(existingPortfolio.about.aboutPic);
        }
        formData.about.aboutPic = `/uploads/${file.filename}`;
      }

      // Project Screenshots
      const projectMatch = file.fieldname.match(/^projectScreenshot(\d+)$/);
      if (projectMatch) {
        const index = parseInt(projectMatch[1], 10);
        if (formData.projects && formData.projects[index]) {
          // delete old screenshot
          if (existingPortfolio?.projects?.[index]?.screenshot) {
            deleteOldFile(existingPortfolio.projects[index].screenshot);
          }
          formData.projects[index].screenshot = `/uploads/${file.filename}`;
        }
      }
    });

    // Save/Update Portfolio
    const portfolio = await Portfolio.findOneAndUpdate({}, formData, {
      new: true,
      upsert: true,
    });

    res.json({ message: "✅ Home Portfolio saved successfully", portfolio });
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({ error: "Failed to save portfolio" });
  }
});

// ---------------- Individual Section Updates ----------------

// Update Personal Information
router.put("/personal", upload.fields([
  { name: "resume" }, 
  { name: "profilePic" }
]), async (req, res) => {
  try {
    const updateData = req.body;

    // file handling
    if (req.files["resume"]) {
      updateData.resume = `/uploads/${req.files["resume"][0].filename}`;
    }
    if (req.files["profilePic"]) {
      updateData.profilePic = `/uploads/${req.files["profilePic"][0].filename}`;
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ message: "✅ Personal info updated successfully", portfolio });
  } catch (err) {
    console.error("PUT /personal Error:", err);
    res.status(500).json({ error: "Failed to update personal info" });
  }
});

// Update About Section
router.put("/about", upload.single("aboutPic"), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.aboutPic = `/uploads/${req.file.filename}`;
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ message: "✅ About updated successfully", portfolio });
  } catch (err) {
    console.error("PUT /about Error:", err);
    res.status(500).json({ error: "Failed to update about" });
  }
});

// Update Education Section
router.put("/education", async (req, res) => {
  try {
    const education = JSON.parse(req.body.education);
    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: { education } },
      { new: true, upsert: true }
    );
    res.json({ message: "✅ Education updated successfully", portfolio });
  } catch (err) {
    console.error("PUT /education Error:", err);
    res.status(500).json({ error: "Failed to update education" });
  }
});

// Update Experiences Section
router.put("/experiences", async (req, res) => {
  try {
    const experiences = JSON.parse(req.body.experiences);
    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: { experiences } },
      { new: true, upsert: true }
    );
    res.json({ message: "✅ Experiences updated successfully", portfolio });
  } catch (err) {
    console.error("PUT /experiences Error:", err);
    res.status(500).json({ error: "Failed to update experiences" });
  }
});

// Update Projects Section
router.put("/projects", upload.any(), async (req, res) => {
  try {
    let projects = JSON.parse(req.body.projects);

    req.files.forEach((file) => {
      const indexMatch = file.fieldname.match(/projects\[(\d+)\]\[screenshot\]/);
      if (indexMatch) {
        const index = parseInt(indexMatch[1], 10);
        if (projects[index]) {
          projects[index].screenshot = `/uploads/${file.filename}`;
        }
      }
    });

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: { projects } },
      { new: true, upsert: true }
    );
    res.json({ message: "✅ Projects updated successfully", portfolio });
  } catch (err) {
    console.error("PUT /projects Error:", err);
    res.status(500).json({ error: "Failed to update projects" });
  }
});

export default router;
