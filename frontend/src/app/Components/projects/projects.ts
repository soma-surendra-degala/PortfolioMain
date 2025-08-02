import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../Directive/scroll';
import { Portfolio } from '../../Services/portfolio';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class Projects implements OnInit {
  loading: boolean = true;
  projects: any[] = [];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  // ✅ Fetch projects via Portfolio service
  fetchProjects() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data: any) => {
        if (data?.projects?.length) {
          this.projects = data.projects.map((proj: any) => ({
            title: proj.projectName || 'Untitled Project',
            type: proj.projectType || 'General',
            description: proj.projectDescription || 'No description available.',
            techStack: Array.isArray(proj.projectSkills) ? proj.projectSkills : [],
            screenshot: proj.screenshot
              ? `${this.getBaseUrl()}${proj.screenshot}`
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

  // ✅ Helper: dynamic backend base URL
  private getBaseUrl(): string {
    return window.location.hostname.includes('localhost')
      ? 'http://localhost:5000'
      : 'https://portfoliomain-sbsy.onrender.com';
  }
}
