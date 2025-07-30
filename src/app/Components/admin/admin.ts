import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  header = {
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    resumeUrl: '',
    aboutQuote: '',
    aboutText: '',
    skillsHeader1: 'Technical Skills',
    skillsHeader2: 'Soft Skills',
    email: '',
    linkedin: '',
    github: '',
    instagram: '',
    twitter: '',
    whatsapp: ''
  };

  // Skills
  skills: string[] = ['', '', '', ''];
  skills1: string[] = ['', '', '', ''];
  skills2: string[] = ['', '', '', ''];

  // Education
  education: any[] = [
    { degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }
  ];

  // Experience
  experiences: any[] = [
    { jobTitle: '', company: '', duration: '', location: '', description: '' }
  ];

  // Projects
  projects: any[] = [
    { projectName: '', projectType: '', projectDescription: '', projectSkills: '', screenshot: null }
  ];

  // File Uploads
  resumeFile: File | null = null;
  profilePicFile: File | null = null;
  aboutPicFile: File | null = null;

  profilePicPreview: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5000/admin/header').subscribe({
      next: (data) => {
        if (data) {
          this.header = { ...this.header, ...data.header };

          this.skills = data.skills?.length === 4 ? data.skills : ['', '', '', ''];
          this.skills1 = data.skills1?.length ? data.skills1 : ['', '', '', ''];
          this.skills2 = data.skills2?.length ? data.skills2 : ['', '', '', ''];

          this.education = data.education?.length ? data.education : this.education;
          this.experiences = data.experiences?.length ? data.experiences : this.experiences;
          this.projects = data.projects?.length ? data.projects : this.projects;
        }
      },
      error: (err) => console.error('❌ Failed to load header:', err)
    });
  }

  // File selection
  onFileSelected(event: any, type: string, index?: number): void {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'resume') this.resumeFile = file;
    if (type === 'profilePic') {
      this.profilePicFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.profilePicPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
    if (type === 'aboutPic') this.aboutPicFile = file;
    if (type === 'projectScreenshot' && index !== undefined) {
      this.projects[index].screenshot = file;
    }
  }

  // Skills
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

  // Education
  addEducation() {
    this.education.push({ degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' });
  }
  removeEducation(index: number) {
    this.education.splice(index, 1);
  }

  // Experience
  addExperience() {
    this.experiences.push({ jobTitle: '', company: '', duration: '', location: '', description: '' });
  }
  removeExperience(index: number) {
    this.experiences.splice(index, 1);
  }

  // Projects
  addProject() {
    this.projects.push({ projectName: '', projectType: '', projectDescription: '', projectSkills: '', screenshot: null });
  }
  removeProject(index: number) {
    this.projects.splice(index, 1);
  }

  // Save
  onSave(): void {
    const formData = new FormData();

    Object.entries(this.header).forEach(([key, value]) =>
      formData.append(key, value || '')
    );

    formData.append('skills', JSON.stringify(this.skills));
    formData.append('skills1', JSON.stringify(this.skills1));
    formData.append('skills2', JSON.stringify(this.skills2));
    formData.append('education', JSON.stringify(this.education));
    formData.append('experiences', JSON.stringify(this.experiences));

    if (this.resumeFile) formData.append('resume', this.resumeFile);
    if (this.profilePicFile) formData.append('profilePic', this.profilePicFile);
    if (this.aboutPicFile) formData.append('aboutPic', this.aboutPicFile);

    this.projects.forEach((project, i) => {
      formData.append(`projects[${i}][projectName]`, project.projectName);
      formData.append(`projects[${i}][projectType]`, project.projectType);
      formData.append(`projects[${i}][projectDescription]`, project.projectDescription);
      formData.append(`projects[${i}][projectSkills]`, project.projectSkills);
      if (project.screenshot) {
        formData.append(`projects[${i}][screenshot]`, project.screenshot);
      }
    });

    this.http.post('http://localhost:5000/admin/header', formData).subscribe({
      next: () => alert('✅ Portfolio updated successfully'),
      error: () => alert('❌ Failed to save portfolio')
    });
  }
}
