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
  isLoading:any =false;

  education: any[] = [
    { degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }
  ];
  
  experiences: any[] = [
    { jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' }
  ];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.fetchData(); // ✅ load data on init
  }

  // ✅ Fetch Education & Experience from backend
  fetchData() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data: any) => {
        this.education = data.education?.length 
          ? data.education 
          : [{ degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }];
          
        this.experiences = data.experiences?.length 
          ? data.experiences 
          : [{ jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' }];
      },
      error: (err: any) => console.error('❌ Failed to load Education/Experience', err)
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
// In AdminExperiences
onSave() {
  this.isLoading = true;
  const data = { experiences: this.experiences, education: this.education };
  const formData = new FormData();
  formData.append('experiences', JSON.stringify(this.experiences));
  formData.append('education', JSON.stringify(this.education));

  this.portfolioService.savePortfolio(formData).subscribe({
    next: () => {
      alert('✅ Experiences updated successfully!');
      this.isLoading = false;
      this.fetchData();
    },
    error: (err) => {
      console.error('❌ Failed to save experiences', err);
      this.isLoading = false;
      alert('❌ Failed to save experiences');
    }
  });
}


  // ✅ Optional Reset Form
  resetForm() {
    this.education = [{ degree: '', field: '', institution: '', startYear: '', endYear: '', grade: '' }];
    this.experiences = [{ jobTitle: '', company: '', location: '', startYear: '', endYear: '', description: '' }];
  }

  trackByIndex(index: number) { return index; }
}
