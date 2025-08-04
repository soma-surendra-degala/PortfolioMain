import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../Services/portfolio';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AdminAbout implements OnInit {
  aboutPicPreview: string | ArrayBuffer | null = null;
  aboutPicFile: File | null = null;

  about = {
    aboutQuote: '',
    aboutText: '',
    skillsHeader1: '',   // ✅ match backend schema
    skillsHeader2: ''    // ✅ match backend schema
  };

  skills1: string[] = [''];
  skills2: string[] = [''];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.fetchAbout();
  }

  // ✅ Fetch About data from backend
  fetchAbout() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        if (data) {
          this.about.aboutQuote = data.aboutQuote || '';
          this.about.aboutText = data.aboutText || '';
          this.about.skillsHeader1 = data.skillsHeader1 || '';
          this.about.skillsHeader2 = data.skillsHeader2 || '';
          this.skills1 = data.skills1?.length ? data.skills1 : this.skills1;
          this.skills2 = data.skills2?.length ? data.skills2 : this.skills2;
          if (data.aboutPic) {
            this.aboutPicPreview = data.aboutPic;
          }
        }
      },
      error: (err) => console.error('❌ Failed to load about section', err)
    });
  }

  // ✅ Handle File Selection
  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'aboutPic') {
      this.aboutPicFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.aboutPicPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  // ✅ Skills Section 1
  addSkill1() { this.skills1.push(''); }
  removeSkill1(index: number) {
    if (this.skills1.length > 1) this.skills1.splice(index, 1);
  }

  // ✅ Skills Section 2
  addSkill2() { this.skills2.push(''); }
  removeSkill2(index: number) {
    if (this.skills2.length > 1) this.skills2.splice(index, 1);
  }

  // ✅ Save About Section
  onSave() {
    const formData = new FormData();
    formData.append('about', JSON.stringify(this.about));
    formData.append('skills1', JSON.stringify(this.skills1));
    formData.append('skills2', JSON.stringify(this.skills2));

    if (this.aboutPicFile) formData.append('aboutPic', this.aboutPicFile);

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => alert('✅ About section saved successfully'),
      error: (err) => {
        console.error('❌ Failed to save about section', err);
        alert('❌ Failed to save about section');
      }
    });
  }

  trackByIndex(index: number) { return index; }
}
