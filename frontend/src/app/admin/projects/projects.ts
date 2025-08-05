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
  isLoading: boolean = false;

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

  // ✅ Fetch projects
  fetchProjects() {
    this.isLoading = true;
    this.portfolioService.getPortfolio().subscribe({
      next: (data: any) => {
        this.projects = data.projects?.length 
          ? data.projects.map((p: any) => ({
              projectName: p.projectName || '',
              projectType: p.projectType || '',
              projectDescription: p.projectDescription || '',
              projectSkills: Array.isArray(p.projectSkills) ? p.projectSkills : [''],
              screenshot: null,
              screenshotPreview: p.screenshot || '',
              github: p.github || '',
              live: p.live || ''
            }))
          : this.projects;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('❌ Failed to load projects', err);
        this.isLoading = false;
      }
    });
  }

  // ✅ Add project
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

  // ✅ Remove project
  removeProject(index: number) {
    if (this.projects.length > 1) this.projects.splice(index, 1);
  }

  // ✅ Manage skills
  addProjectSkill(projectIndex: number) {
    this.projects[projectIndex].projectSkills.push('');
  }
  removeProjectSkill(projectIndex: number, skillIndex: number) {
    if (this.projects[projectIndex].projectSkills.length > 1) {
      this.projects[projectIndex].projectSkills.splice(skillIndex, 1);
    }
  }

  // ✅ File upload
  onFileSelected(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (!file || type !== 'projectScreenshot' || index === undefined) return;

    this.projects[index].screenshot = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.projects[index].screenshotPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ✅ Save projects
  onSave() {
    this.isLoading = true;

    const formData = new FormData();

    // Build JSON part (exclude preview)
    const projectsPayload = this.projects.map((p) => {
      const proj = { ...p };
      delete proj.screenshot;
      delete proj.screenshotPreview;
      return proj;
    });
    formData.append('projects', JSON.stringify(projectsPayload));

    // Append screenshots
    this.projects.forEach((project, i) => {
      if (project.screenshot instanceof File) {
        formData.append('screenshots', project.screenshot);
      }
    });

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => {
        alert('✅ Projects saved successfully');
        this.fetchProjects();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('❌ Failed to save projects', err);
        alert('❌ Failed to save projects');
        this.isLoading = false;
      }
    });
  }

  // ✅ Reset
  resetForm() {
    this.projects = [
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
  }

  trackByIndex(index: number) { return index; }
}
