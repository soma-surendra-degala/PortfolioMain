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
  loading: boolean = false;
  trackByIndex(index: number, obj: any): any {
  return index;
}

  header = {
    firstName: '', middleName: '', lastName: '', role: '',
    resumeUrl: '', aboutQuote: '', aboutText: '',
    skillsHeader1: 'Technical Skills', skillsHeader2: 'Soft Skills',
    email: '', linkedin: '', github: '', instagram: '', twitter: '', whatsapp: ''
  };

  skills: string[] = ['', '', '', ''];
  skills1: string[] = [''];
  skills2: string[] = [''];

  addHighlightSkill() {
    this.skills.push('');
  }

  removeHighlightSkill(index: number) {
    if (this.skills.length > 1) {
      this.skills.splice(index, 1);
    }
  }
  addSkill1() {
    this.skills1.push('');
  }

  removeSkill1(index: number) {
    this.skills1.splice(index, 1);
  }


  
  addSkill2() {
    this.skills2.push('');
  }

  removeSkill2(index: number) {
    this.skills2.splice(index, 1);
  }

  education: any[] = [
    { degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }
  ];

  experiences: any[] = [
    { jobTitle: '', company: '', duration: '', location: '', description: '' }
  ];

  projects: any[] = [
    { projectName: '', projectType: '', projectDescription: '', projectSkills: '', screenshot: null }
  ];

  resumeFile: File | null = null;
  profilePicFile: File | null = null;
  aboutPicFile: File | null = null;
  profilePicPreview: string | ArrayBuffer | null = null;
  aboutPicPreview: string | ArrayBuffer | null = null;

  // ✅ Projects
addProject() {
  this.projects.push({
    projectName: '',
    projectType: '',
    projectDescription: '',
    projectSkills: '',
    screenshot: null
  });
}

removeProject(index: number) {
  if (this.projects.length > 1) {
    this.projects.splice(index, 1);
  }
}
// Add Experience
  addExperience() {
    this.experiences.push({
      jobTitle: '',
      company: '',
      duration: '',
      location: '',
      description: ''
    });
  }

  // Remove Experience
  removeExperience(index: number) {
    this.experiences.splice(index, 1);
  }


  // Add Education
  addEducation() {
    this.education.push({
      degree: '',
      field: '',
      institution: '',
      startYear: '',
      endYear: '',
      grade: ''
    });
  }

  // Remove Education
  removeEducation(index: number) {
    this.education.splice(index, 1);
  }
  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.fetchPortfolio();
  }

  // ✅ Fetch Portfolio Data
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
          this.projects = data.projects?.length ? data.projects : this.projects;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load portfolio', err);
        this.loading = false;
      }
    });
  }

  // ✅ Handle File Upload
  onFileSelected(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'resume') this.resumeFile = file;
    if (type === 'profilePic') {
      this.profilePicFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.profilePicPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
    if (type === 'aboutPic') 
      {
      this.aboutPicFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.aboutPicPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
    if (type === 'projectScreenshot' && index !== undefined) {
      // this.projectScreenshot = file;
      // const reader = new FileReader();
      // reader.onload = (e) => (this.projectScreenshot = e.target?.result || null);
      // reader.readAsDataURL(file);
      this.projects[index].screenshot = file;
    }
  }

  // ✅ Save Data
  onSave() {
    this.loading = true;
    const formData = new FormData();

    formData.append('header', JSON.stringify(this.header));
    formData.append('skills', JSON.stringify(this.skills));
    formData.append('skills1', JSON.stringify(this.skills1));
    formData.append('skills2', JSON.stringify(this.skills2));
    formData.append('education', JSON.stringify(this.education));
    formData.append('experiences', JSON.stringify(this.experiences));
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
}
