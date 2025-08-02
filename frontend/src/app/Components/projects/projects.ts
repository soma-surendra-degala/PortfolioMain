import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ScrollRevealDirective } from '../../Directive/scroll';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class Projects implements OnInit {
  loading = true;
  projects: any[] = [];
  apiUrl = 'https://portfoliomain-sbsy.onrender.com';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.http.get(`${this.apiUrl}/`).subscribe({
      next: (data: any) => {
        if (data?.projects?.length) {
          this.projects = data.projects.map((proj: any) => ({
            title: proj.projectName || 'Untitled Project',
            type: proj.projectType || 'General',
            description: proj.projectDescription || 'No description available.',
            techStack: Array.isArray(proj.projectSkills) ? proj.projectSkills : [],
            screenshot: proj.screenshot
              ? `${this.apiUrl}${proj.screenshot}`
              : 'assets/no-image.png',
            github: proj.github || '#',
            live: proj.live || null
          }));
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load projects', err);
        this.loading = false;
      }
    });
  }
}
