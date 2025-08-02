import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  role: String,
  resume: String,
  aboutQuote: String,
  aboutText: String,
  skills: [String],
  skillsHeader1: String,
  skillsHeader2: String, 
  skills1: [String],
  skills2: [String],
  email: String,
  linkedin: String,
  github: String,
  instagram: String,
  twitter: String,
  whatsapp: String,
  education: [
    {
      degree: String,
      field: String,
      institution: String,
      startYear: String,
      endYear: String,
      grade: String
    }
  ],
  experiences: [
    {
       jobTitle: String,
  company: String,
  location: String,
  description: String,
  startYear: String,
  endYear: String,
    }
  ],
  projects: [
    {
      projectName: String,
      projectType: String,
      projectSkills: [String],
      projectDescription: String,
      screenshot: String,
       github: String,
      live: String
    }
  ],
  aboutPic: String,
  profilePic: String,

});

export default mongoose.model("Portfolio", portfolioSchema);
