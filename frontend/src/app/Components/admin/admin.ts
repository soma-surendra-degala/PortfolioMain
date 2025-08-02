import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loader } from '../loader/loader';
import { Portfolio } from '../../Services/portfolio';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, Loader, HttpClientModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  
  // ----------------- UI State -----------------
  loading: boolean = false;
  profilePicPreview: string | ArrayBuffer | null = null;
  aboutPicPreview: string | ArrayBuffer | null = null;

  // ----------------- Header Data -----------------
header: {
  [key: string]: any;   // <-- add this line
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  resume: string;
  aboutQuote: string;
  aboutText: string;
  skillsHeader1: string;
  skillsHeader2: string;
  email: string;
  linkedin: string;
  github: string;
  instagram: string;
  twitter: string;
  whatsapp: string;
} = {
  firstName: '',
  middleName: '',
  lastName: '',
  role: '',
  resume: '',
  aboutQuote: '',
  aboutText: '',
  skillsHeader1: '',
  skillsHeader2: '',
  email: '',
  linkedin: '',
  github: '',
  instagram: '',
  twitter: '',
  whatsapp: ''
};


  // ----------------- Skills -----------------
  skills: string[] = ['', '', '', ''];
  skills1: string[] = [''];
  skills2: string[] = [''];

  // ----------------- Files -----------------
  resumeFile: File | null = null;
  profilePicFile: File | null = null;
  aboutPicFile: File | null = null;

  // ----------------- Education, Experience, Projects -----------------
  education: any[] = [
    { degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }
  ];

  experiences: any[] = [
    { jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' }
  ];

  projects: any[] = [
    { projectName: '', projectType: '', projectDescription: '', projectSkills: [''], screenshot: null, screenshotPreview: '', github: '', live: '' }
  ];

  // ----------------- Contact Highlights -----------------
  contactHighlights: any[] = [
    { icon: 'bi bi-code-slash', color: '#0d6efd', title: '', desc: '' }
  ];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.fetchPortfolio();
  }

  // ----------------- Portfolio Fetch -----------------
  fetchPortfolio() {
    this.loading = true;
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        if (data) {
          this.header = { ...this.header, ...data.header };
          this.skills = data.skills?.length ? data.skills : this.skills;
          this.skills1 = data.skills1?.length ? data.skills1 : this.skills1;
          this.skills2 = data.skills2?.length ? data.skills2 : this.skills2;
          this.education = data.education?.length ? data.education : this.education;
          this.experiences = data.experiences?.length ? data.experiences : this.experiences;
          this.contactHighlights = data.contactHighlights?.length ? data.contactHighlights : this.contactHighlights;
          this.projects = data.projects?.length
            ? data.projects.map((p: any) => ({
                projectName: p.projectName || '',
                projectType: p.projectType || '',
                projectDescription: p.projectDescription || '',
                projectSkills: Array.isArray(p.projectSkills) ? p.projectSkills : [''],
                screenshot: null,
                screenshotPreview: '',
                github: p.github || '',
                live: p.live || ''
              }))
            : this.projects;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load portfolio', err);
        this.loading = false;
      }
    });
  }

  // ----------------- File Selection -----------------
  onFileSelected(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'resume') {
      this.resumeFile = file;
    }

    if (type === 'profilePic') {
      this.profilePicFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.profilePicPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }

    if (type === 'aboutPic') {
      this.aboutPicFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.aboutPicPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }

    if (type === 'projectScreenshot' && index !== undefined) {
      this.projects[index].screenshot = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.projects[index].screenshotPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  // ----------------- Add / Remove Skills -----------------
  addHighlightSkill() { this.skills.push(''); }
  removeHighlightSkill(index: number) { if (this.skills.length > 1) this.skills.splice(index, 1); }

  addSkill1() { this.skills1.push(''); }
  removeSkill1(index: number) { this.skills1.splice(index, 1); }

  addSkill2() { this.skills2.push(''); }
  removeSkill2(index: number) { this.skills2.splice(index, 1); }

  // ----------------- Add / Remove Education -----------------
  addEducation() {
    this.education.push({ degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' });
  }
  removeEducation(index: number) { this.education.splice(index, 1); }

  // ----------------- Add / Remove Experience -----------------
  addExperience() {
    this.experiences.push({ jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' });
  }
  removeExperience(index: number) { this.experiences.splice(index, 1); }

  // ----------------- Add / Remove Projects -----------------
  addProject() {
    this.projects.push({ projectName: '', projectType: '', projectDescription: '', projectSkills: [''], screenshot: null, screenshotPreview: '', github: '', live: '' });
  }
  removeProject(index: number) { if (this.projects.length > 1) this.projects.splice(index, 1); }

  addProjectSkill(projectIndex: number) {
    if (!Array.isArray(this.projects[projectIndex].projectSkills)) {
      this.projects[projectIndex].projectSkills = [];
    }
    this.projects[projectIndex].projectSkills.push('');
  }
  removeProjectSkill(projectIndex: number, skillIndex: number) {
    if (this.projects[projectIndex].projectSkills && this.projects[projectIndex].projectSkills.length > 1) {
      this.projects[projectIndex].projectSkills.splice(skillIndex, 1);
    }
  }

  // ----------------- Add / Remove Contact Highlights -----------------
  addContactHighlight() { this.contactHighlights.push({ icon: '', color: '', title: '', desc: '' }); }
  removeContactHighlight(index: number) { if (this.contactHighlights.length > 1) this.contactHighlights.splice(index, 1); }

  // ----------------- Save Portfolio -----------------
  onSave() {
    this.loading = true;
    const formData = new FormData();

    formData.append('header', JSON.stringify(this.header));
    formData.append('skills', JSON.stringify(this.skills));
    formData.append('skills1', JSON.stringify(this.skills1));
    formData.append('skills2', JSON.stringify(this.skills2));
    formData.append('education', JSON.stringify(this.education));
    formData.append('experiences', JSON.stringify(this.experiences));
    formData.append('contactHighlights', JSON.stringify(this.contactHighlights));

    formData.append('projects', JSON.stringify(this.projects.map((p) => {
      const proj = { ...p };
      if (proj.screenshot instanceof File) proj.screenshot = '';
      return proj;
    })));

    if (this.resumeFile) formData.append('resume', this.resumeFile);
    if (this.profilePicFile) formData.append('profilePic', this.profilePicFile);
    if (this.aboutPicFile) formData.append('aboutPic', this.aboutPicFile);

    this.projects.forEach((project, i) => {
      if (project.screenshot instanceof File) {
        formData.append(`projects[${i}][screenshot]`, project.screenshot);
      }
    });

    // Ensure live links have https://
    this.projects.forEach(p => {
      if (p.live && !/^https?:\/\//i.test(p.live)) {
        p.live = 'https://' + p.live;
      }
    });

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => {
        alert('✅ Portfolio updated successfully');
        this.loading = false;
        this.fetchPortfolio();
      },
      error: (err) => {
        console.error('❌ Failed to save portfolio', err);
        alert('❌ Failed to save portfolio');
        this.loading = false;
      }
    });
  }

  // ----------------- Track By -----------------
  trackByIndex(index: number): any { return index; }
}
