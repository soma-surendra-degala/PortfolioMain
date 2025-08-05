// import express from "express";
// import multer from "multer";
// import path from "path";
// import Portfolio from "../models/portfolioModel.js";
// import defaultPortfolio from "../defaultPortfolio.js";

// const router = express.Router();

// // ---------------- Multer Storage Config ----------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
// });

// // ---------------- GET Full Portfolio ----------------
// router.get("/", async (req, res) => {
//   try {
//     let portfolio = await Portfolio.findOne({});
//     if (!portfolio) {
//       portfolio = await Portfolio.create(defaultPortfolio);
//       console.log("🌱 Default portfolio inserted!");
//     }
//     res.json(portfolio);
//   } catch (err) {
//     console.error("GET Error:", err);
//     res.status(500).json({ error: "Failed to fetch portfolio" });
//   }
// });
// // ---------------- POST Create/Update Full Portfolio ----------------
// router.post("/", upload.any(), async (req, res) => {
//   try {
//     let formData = req.body;

//     // Parse JSON strings
//     if (formData.header && typeof formData.header === "string") {
//       formData.header = JSON.parse(formData.header);
//     }

//     ["skills", "skills1", "skills2", "education", "experiences", "projects"].forEach(
//       (field) => {
//         if (formData[field] && typeof formData[field] === "string") {
//           formData[field] = JSON.parse(formData[field]);
//         }
//       }
//     );

//     // Get existing portfolio (for merging)
//     let existingPortfolio = await Portfolio.findOne({});

//     // Handle uploaded files
//     req.files.forEach((file) => {
//       if (file.fieldname === "aboutPic")
//         formData.aboutPic = `/uploads/${file.filename}`;
//       if (file.fieldname === "profilePic")
//         formData.header.profilePic = `/uploads/${file.filename}`;
//       if (file.fieldname === "resume")
//         formData.header.resume = `/uploads/${file.filename}`;

//       // For project screenshots
//       if (file.fieldname.startsWith("projects")) {
//         const indexMatch = file.fieldname.match(/projects\[(\d+)\]\[screenshot\]/);
//         if (indexMatch) {
//           const index = parseInt(indexMatch[1], 10);
//           if (formData.projects && formData.projects[index]) {
//             formData.projects[index].screenshot = `/uploads/${file.filename}`;
//           }
//         }
//       }
//     });

//     // Merge with existing (so nothing gets wiped)
//     const updateData = {
//       ...existingPortfolio?._doc,
//       ...formData,
//       header: {
//         ...(existingPortfolio?.header || {}),
//         ...(formData.header || {})
//       }
//     };

//     // Save merged data
//     const portfolio = await Portfolio.findOneAndUpdate({}, updateData, {
//       new: true,
//       upsert: true,
//     });

//     res.json({ message: "✅ Portfolio saved successfully", portfolio });
//   } catch (err) {
//     console.error("POST Error:", err);
//     res.status(500).json({ error: "Failed to save portfolio" });
//   }
// });

// // ---------------- Individual Section Updates ----------------

// // Update Personal Information
// router.put("/personal", upload.fields([
//   { name: "resume" }, 
//   { name: "profilePic" }
// ]), async (req, res) => {
//   try {
//     const updateData = req.body;

//     // file handling
//     if (req.files["resume"]) {
//       updateData.resume = `/uploads/${req.files["resume"][0].filename}`;
//     }
//     if (req.files["profilePic"]) {
//       updateData.profilePic = `/uploads/${req.files["profilePic"][0].filename}`;
//     }

//     const portfolio = await Portfolio.findOneAndUpdate(
//       {},
//       { $set: updateData },
//       { new: true, upsert: true }
//     );
//     res.json({ message: "✅ Personal info updated successfully", portfolio });
//   } catch (err) {
//     console.error("PUT /personal Error:", err);
//     res.status(500).json({ error: "Failed to update personal info" });
//   }
// });

// // Updating About
// router.post("/save", upload.fields([
//   { name: "aboutPic", maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     // Parse stringified fields
//     const about = JSON.parse(req.body.about || "{}");
//     const skills1 = JSON.parse(req.body.skills1 || "[]");
//     const skills2 = JSON.parse(req.body.skills2 || "[]");

//     const updateData = {
//       aboutQuote: about.aboutQuote || "",
//       aboutText: about.aboutText || "",
//       skillsHeader1: about.skillsHeader1 || "",
//       skillsHeader2: about.skillsHeader2 || "",
//       skills1,
//       skills2
//     };

//     if (req.files?.aboutPic) {
//       updateData.aboutPic = `/uploads/${req.files.aboutPic[0].filename}`;
//     }

//     // Update portfolio
//     const portfolio = await Portfolio.findOneAndUpdate({}, updateData, { new: true, upsert: true });
//     res.json(portfolio);
//   } catch (err) {
//     console.error("Save error:", err);
//     res.status(500).json({ message: "Failed to save About section" });
//   }
// });

// // Update Education Section
// router.put("/education", async (req, res) => {
//   try {
//     const education = JSON.parse(req.body.education);
//     const portfolio = await Portfolio.findOneAndUpdate(
//       {},
//       { $set: { education } },
//       { new: true, upsert: true }
//     );
//     res.json({ message: "✅ Education updated successfully", portfolio });
//   } catch (err) {
//     console.error("PUT /education Error:", err);
//     res.status(500).json({ error: "Failed to update education" });
//   }
// });

// // Update Experiences Section
// router.put("/experiences", async (req, res) => {
//   try {
//     const experiences = JSON.parse(req.body.experiences);
//     const portfolio = await Portfolio.findOneAndUpdate(
//       {},
//       { $set: { experiences } },
//       { new: true, upsert: true }
//     );
//     res.json({ message: "✅ Experiences updated successfully", portfolio });
//   } catch (err) {
//     console.error("PUT /experiences Error:", err);
//     res.status(500).json({ error: "Failed to update experiences" });
//   }
// });

// // Update Projects Section
// router.put("/projects", upload.any(), async (req, res) => {
//   try {
//     let projects = JSON.parse(req.body.projects);

//     req.files.forEach((file) => {
//       const indexMatch = file.fieldname.match(/projects\[(\d+)\]\[screenshot\]/);
//       if (indexMatch) {
//         const index = parseInt(indexMatch[1], 10);
//         if (projects[index]) {
//           projects[index].screenshot = `/uploads/${file.filename}`;
//         }
//       }
//     });

//     const portfolio = await Portfolio.findOneAndUpdate(
//       {},
//       { $set: { projects } },
//       { new: true, upsert: true }
//     );
//     res.json({ message: "✅ Projects updated successfully", portfolio });
//   } catch (err) {
//     console.error("PUT /projects Error:", err);
//     res.status(500).json({ error: "Failed to update projects" });
//   }
// });

// export default router;
// routes/portfolioRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Portfolio from "../models/portfolioModel.js";
import defaultPortfolio from "../defaultPortfolio.js";

const router = express.Router();

// ---------- Multer Setup ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ---------- Get Portfolio ----------
router.get("/", async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();

    // ✅ If empty DB, insert defaultPortfolio
    if (!portfolio) {
      portfolio = await Portfolio.create({ ...defaultPortfolio, isDefault: true });
      console.log("🌱 Default portfolio inserted on GET");
    } else {
      portfolio = portfolio.toObject();
      portfolio.isDefault = false; // ✅ mark real data
    }

    res.json(portfolio);
  } catch (err) {
    console.error("❌ Failed to fetch portfolio:", err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

// ---------- Save / Update Portfolio ----------
router.post(
  "/",
  upload.any(), // accept any files
  async (req, res) => {
    try {
      let body = req.body;

      // ✅ Parse arrays safely
      for (let key of [
        "skills", "skills1", "skills2", 
        "education", "experiences", "projects"
      ]) {
        if (body[key] && typeof body[key] === "string") {
          try {
            body[key] = JSON.parse(body[key]);
          } catch (err) {
            console.warn(`⚠️ Could not parse ${key}:`, err.message);
            body[key] = [];
          }
        }
      }

      // ✅ Attach main files
      const fileMap = {};
      if (req.files?.length) {
        req.files.forEach((file) => {
          fileMap[file.fieldname] = file.filename;
        });
      }

      // Resume & Pics
      if (fileMap.resume) {
        body.resume = "/uploads/" + fileMap.resume;
      }
      if (fileMap.profilePic) {
        body.profilePic = "/uploads/" + fileMap.profilePic;
      }
      if (fileMap.aboutPic) {
        body.aboutPic = "/uploads/" + fileMap.aboutPic;
      }

      // ✅ Handle project screenshots
      if (Array.isArray(body.projects)) {
        body.projects = body.projects.map((proj, idx) => {
          const fileKey = `screenshot_${idx}`;
          if (fileMap[fileKey]) {
            proj.screenshot = "/uploads/" + fileMap[fileKey];
          }
          return proj;
        });
      }

      // ✅ Save or update portfolio
      const updatedPortfolio = await Portfolio.findOneAndUpdate(
        {},
        { $set: { ...body, isDefault: false } },
        { new: true, upsert: true }
      );

      res.json(updatedPortfolio);
    } catch (err) {
      console.error("❌ Failed to save portfolio:", err);
      res.status(500).json({ error: "Failed to save portfolio" });
    }
  }
);

export default router;
