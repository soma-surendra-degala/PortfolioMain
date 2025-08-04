import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../Services/portfolio';

@Component({
  selector: 'app-admin-experiences',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './experiences.html',
  styleUrls: ['./experiences.css']
})
export class AdminExperiences implements OnInit {

  education: any[] = [
    { degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }
  ];

  experiences: any[] = [
    { jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' }
  ];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.fetchData();
  }

  // Fetch portfolio education & experiences
  fetchData() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.education = data.education?.length ? data.education : this.education;
        this.experiences = data.experiences?.length ? data.experiences : this.experiences;
      },
      error: (err) => console.error('❌ Failed to load education/experiences', err)
    });
  }

  // Education Management
  addEducation() {
    this.education.push({ degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' });
  }
  removeEducation(index: number) {
    if (this.education.length > 1) this.education.splice(index, 1);
  }

  // Experience Management
  addExperience() {
    this.experiences.push({ jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' });
  }
  removeExperience(index: number) {
    if (this.experiences.length > 1) this.experiences.splice(index, 1);
  }

  // Save data
  onSave() {
    const formData = new FormData();
    formData.append('education', JSON.stringify(this.education));
    formData.append('experiences', JSON.stringify(this.experiences));

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => alert('✅ Education & Experience saved successfully'),
      error: (err) => {
        console.error('❌ Failed to save', err);
        alert('❌ Failed to save Education/Experience');
      }
    });
  }

  trackByIndex(index: number) { return index; }
}
