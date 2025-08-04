import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../Services/portfolio';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class AdminProjects implements OnInit {

  projects: any[] = [
    { 
      projectName: '', 
      projectType: '', 
      projectDescription: '', 
      projectSkills: [''], 
      screenshot: null, 
      screenshotPreview: '', 
      github: '', 
      live: '' 
    }
  ];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  // Fetch projects from backend
  fetchProjects() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.projects = data.projects?.length 
          ? data.projects.map((p: any) => ({
              projectName: p.projectName || '',
              projectType: p.projectType || '',
              projectDescription: p.projectDescription || '',
              projectSkills: Array.isArray(p.projectSkills) ? p.projectSkills : [''],
              screenshot: null,
              screenshotPreview: p.screenshot ? p.screenshot : '',
              github: p.github || '',
              live: p.live || ''
            }))
          : this.projects;
      },
      error: (err) => console.error('❌ Failed to load projects', err)
    });
  }

  // Add & Remove Project
  addProject() {
    this.projects.push({ 
      projectName: '', 
      projectType: '', 
      projectDescription: '', 
      projectSkills: [''], 
      screenshot: null, 
      screenshotPreview: '', 
      github: '', 
      live: '' 
    });
  }
  removeProject(index: number) {
    if (this.projects.length > 1) this.projects.splice(index, 1);
  }

  // Add & Remove Project Skill
  addProjectSkill(projectIndex: number) {
    this.projects[projectIndex].projectSkills.push('');
  }
  removeProjectSkill(projectIndex: number, skillIndex: number) {
    if (this.projects[projectIndex].projectSkills.length > 1) {
      this.projects[projectIndex].projectSkills.splice(skillIndex, 1);
    }
  }

  // Handle File Selection
  onFileSelected(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (!file || type !== 'projectScreenshot' || index === undefined) return;

    this.projects[index].screenshot = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.projects[index].screenshotPreview = e.target?.result || '';
    };
    reader.readAsDataURL(file);
  }

  // Save Projects
  onSave() {
    const formData = new FormData();

    formData.append('projects', JSON.stringify(this.projects.map((p) => {
      const proj = { ...p };
      if (proj.screenshot instanceof File) proj.screenshot = '';
      return proj;
    })));

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
      next: () => alert('✅ Projects saved successfully'),
      error: (err) => {
        console.error('❌ Failed to save projects', err);
        alert('❌ Failed to save projects');
      }
    });
  }

  trackByIndex(index: number) { return index; }
}
