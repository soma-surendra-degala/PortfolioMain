import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../Services/portfolio';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adminhome.html',
  styleUrls: ['./adminhome.css']
})
export class Adminhome implements OnInit {
  // Personal Info
  header: any = {
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    resume: '',
    profilePic: '',
    email: '',
    linkedin: '',
    github: '',
    instagram: '',
    twitter: '',
    whatsapp: ''
  };

  // File Uploads
  profilePicFile: File | null = null;
  profilePicPreview: string = '';
  resumeFile: File | null = null;
  aboutPicFile: File | null = null;
  aboutPicPreview: string = '';

  // About Section
  about: any = {
    aboutQuote: '',
    aboutText: '',
    skillsHeader1: '',
    skillsHeader2: ''
  };

  // Skills
  skills: string[] = ['', '', '', ''];
  skills1: string[] = [''];
  skills2: string[] = [''];

  // Education
  education: any[] = [
    { degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }
  ];

  // Experience
  experiences: any[] = [
    { jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' }
  ];

  // Projects
  projects: any[] = [
    { projectName: '', projectType: '', projectDescription: '', github: '', live: '', projectSkills: [''], screenshotPreview: '', screenshotFile: null }
  ];

  // Social Links
  socialLinks = [
    { key: 'email', icon: 'envelope', type: 'email', placeholder: 'your@email.com' },
    { key: 'linkedin', icon: 'linkedin', type: 'url', placeholder: 'LinkedIn URL' },
    { key: 'github', icon: 'github', type: 'url', placeholder: 'GitHub URL' },
    { key: 'instagram', icon: 'instagram', type: 'url', placeholder: 'Instagram URL' },
    { key: 'twitter', icon: 'twitter', type: 'url', placeholder: 'Twitter URL' },
    { key: 'whatsapp', icon: 'whatsapp', type: 'text', placeholder: '+91-XXXXXXXXXX' }
  ];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  // Load Data
  loadHomeData() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.header = { ...this.header, ...data.header };
        this.about = { ...this.about, ...data.about };
        this.skills = data.skills?.length ? data.skills : this.skills;
        this.skills1 = data.skills1?.length ? data.skills1 : [''];
        this.skills2 = data.skills2?.length ? data.skills2 : [''];
        this.education = data.education?.length ? data.education : this.education;
        this.experiences = data.experiences?.length ? data.experiences : this.experiences;
        this.projects = data.projects?.length ? data.projects : this.projects;
        if (data.header?.profilePic) this.profilePicPreview = data.header.profilePic;
        if (data.about?.aboutPic) this.aboutPicPreview = data.about.aboutPic;
      },
      error: (err) => console.error('❌ Failed to load home data', err)
    });
  }

  // File Selection
  onFileSelected(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'profilePic') {
        this.profilePicFile = file;
        this.profilePicPreview = e.target?.result as string;
      } else if (type === 'resume') {
        this.resumeFile = file;
      } else if (type === 'aboutPic') {
        this.aboutPicFile = file;
        this.aboutPicPreview = e.target?.result as string;
      } else if (type === 'projectScreenshot' && index !== undefined) {
        this.projects[index].screenshotFile = file;
        this.projects[index].screenshotPreview = e.target?.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  // Helpers
  getValue(key: string): string {
    return this.header[key] || '';
  }
  setValue(key: string, value: string) {
    this.header[key] = value;
  }

  // Skill Handlers
  addSkill1() { this.skills1.push(''); }
  removeSkill1(i: number) { this.skills1.splice(i, 1); }

  addSkill2() { this.skills2.push(''); }
  removeSkill2(j: number) { this.skills2.splice(j, 1); }

  // Education
  addEducation() {
    this.education.push({ degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' });
  }
  removeEducation(i: number) { this.education.splice(i, 1); }

  // Experience
  addExperience() {
    this.experiences.push({ jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' });
  }
  removeExperience(i: number) { this.experiences.splice(i, 1); }

  // Projects
  addProject() {
    this.projects.push({ projectName: '', projectType: '', projectDescription: '', github: '', live: '', projectSkills: [''], screenshotPreview: '', screenshotFile: null });
  }
  removeProject(i: number) { this.projects.splice(i, 1); }

  addProjectSkill(i: number) { this.projects[i].projectSkills.push(''); }
  removeProjectSkill(i: number, k: number) { this.projects[i].projectSkills.splice(k, 1); }

  trackByIndex(index: number) { return index; }

  // Save Data
  onSave() {
    const formData = new FormData();
    formData.append('header', JSON.stringify(this.header));
    formData.append('about', JSON.stringify(this.about));
    formData.append('skills', JSON.stringify(this.skills));
    formData.append('skills1', JSON.stringify(this.skills1));
    formData.append('skills2', JSON.stringify(this.skills2));
    formData.append('education', JSON.stringify(this.education));
    formData.append('experiences', JSON.stringify(this.experiences));
    formData.append('projects', JSON.stringify(this.projects.map(p => ({ ...p, screenshotFile: undefined }))));

    if (this.profilePicFile) formData.append('profilePic', this.profilePicFile);
    if (this.resumeFile) formData.append('resume', this.resumeFile);
    if (this.aboutPicFile) formData.append('aboutPic', this.aboutPicFile);
    this.projects.forEach((p, i) => {
      if (p.screenshotFile) formData.append(`projectScreenshot${i}`, p.screenshotFile);
    });

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => alert('✅ Home Data saved successfully!'),
      error: (err) => {
        console.error('❌ Failed to save home data', err);
        alert('❌ Failed to save home data');
      }
    });
  }
}
