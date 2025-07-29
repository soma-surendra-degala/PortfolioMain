import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports:[FormsModule,CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin {
  projects = [
    { title: 'Portfolio Website', category: 'Web Development', link: 'https://example.com' },
    { title: 'Data Analysis', category: 'Data Science', link: 'https://example.com' }
  ];

  newProject = { title: '', category: '', link: '' };

  addProject() {
    if (this.newProject.title && this.newProject.category && this.newProject.link) {
      this.projects.push({ ...this.newProject });
      this.newProject = { title: '', category: '', link: '' }; // clear form
    }
  }

  deleteProject(index: number) {
    this.projects.splice(index, 1);
  }
}
