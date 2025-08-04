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

  // ✅ Fetch Education & Experience from backend
  fetchData() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        if (data.education?.length) this.education = data.education;
        if (data.experiences?.length) this.experiences = data.experiences;
      },
      error: (err) => console.error('❌ Failed to load Education/Experience', err)
    });
  }

  // ✅ Education Handlers
  addEducation() {
    this.education.push({ degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' });
  }
  removeEducation(index: number) {
    if (this.education.length > 1) this.education.splice(index, 1);
  }

  // ✅ Experience Handlers
  addExperience() {
    this.experiences.push({ jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' });
  }
  removeExperience(index: number) {
    if (this.experiences.length > 1) this.experiences.splice(index, 1);
  }

  // ✅ Save Education & Experience
  onSave() {
    const formData = new FormData();
    formData.append('education', JSON.stringify(this.education));
    formData.append('experiences', JSON.stringify(this.experiences));

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => alert('✅ Education & Experience saved successfully'),
      error: (err) => {
        console.error('❌ Failed to save Education/Experience', err);
        alert('❌ Failed to save Education/Experience');
      }
    });
  }

  trackByIndex(index: number) { return index; }
}
