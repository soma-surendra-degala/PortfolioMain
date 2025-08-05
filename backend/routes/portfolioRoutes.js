import express from "express";
import multer from "multer";
import path from "path";
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
// ---------------- POST Create/Update Full Portfolio ----------------
router.post("/", upload.any(), async (req, res) => {
  try {
    let formData = req.body;

    // Parse JSON strings
    if (formData.header && typeof formData.header === "string") {
      formData.header = JSON.parse(formData.header);
    }

    ["skills", "skills1", "skills2", "education", "experiences", "projects"].forEach(
      (field) => {
        if (formData[field] && typeof formData[field] === "string") {
          formData[field] = JSON.parse(formData[field]);
        }
      }
    );

    // Get existing portfolio (for merging)
    let existingPortfolio = await Portfolio.findOne({});

    // Handle uploaded files
    req.files.forEach((file) => {
      if (file.fieldname === "aboutPic")
        formData.aboutPic = `/uploads/${file.filename}`;
      if (file.fieldname === "profilePic")
        formData.header.profilePic = `/uploads/${file.filename}`;
      if (file.fieldname === "resume")
        formData.header.resume = `/uploads/${file.filename}`;

      // For project screenshots
      if (file.fieldname.startsWith("projects")) {
        const indexMatch = file.fieldname.match(/projects\[(\d+)\]\[screenshot\]/);
        if (indexMatch) {
          const index = parseInt(indexMatch[1], 10);
          if (formData.projects && formData.projects[index]) {
            formData.projects[index].screenshot = `/uploads/${file.filename}`;
          }
        }
      }
    });

    // Merge with existing (so nothing gets wiped)
    const updateData = {
      ...existingPortfolio?._doc,
      ...formData,
      header: {
        ...(existingPortfolio?.header || {}),
        ...(formData.header || {})
      }
    };

    // Save merged data
    const portfolio = await Portfolio.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json({ message: "✅ Portfolio saved successfully", portfolio });
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
