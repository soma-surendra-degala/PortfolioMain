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
  isLoading:boolean = false;
  about: any = {
    aboutQuote: '',
    aboutText: '',
    skillsHeader1: '',
    skillsHeader2: ''
  };

  skills1: string[] = [''];
  skills2: string[] = [''];
  aboutPicFile: File | null = null;
  aboutPicPreview: string = '';

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.loadAboutData();
  }

  // ✅ Fetch About Section data
  loadAboutData() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data: any) => {
        this.about = {
          aboutQuote: data.aboutQuote || '',
          aboutText: data.aboutText || '',
          skillsHeader1: data.skillsHeader1 || '',
          skillsHeader2: data.skillsHeader2 || ''
        };

        this.skills1 = data.skills1?.length ? data.skills1 : [''];
        this.skills2 = data.skills2?.length ? data.skills2 : [''];

        if (data.aboutPic) {
          this.aboutPicPreview = data.aboutPic;
        }
      },
      error: (err: any) => console.error('❌ Failed to load about data', err)
    });
  }

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.aboutPicFile = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.aboutPicPreview = e.target?.result as string);
    reader.readAsDataURL(file);
  }
}


  addSkill1() { this.skills1.push(''); }
  removeSkill1(i: number) { if (this.skills1.length > 1) this.skills1.splice(i, 1); }

  addSkill2() { this.skills2.push(''); }
  removeSkill2(j: number) { if (this.skills2.length > 1) this.skills2.splice(j, 1); }

  // ✅ Save About Section
  onSave() {
    this.isLoading=true;
    const formData = new FormData();
    formData.append('aboutQuote', this.about.aboutQuote || '');
    formData.append('aboutText', this.about.aboutText || '');
    formData.append('skillsHeader1', this.about.skillsHeader1 || '');
    formData.append('skillsHeader2', this.about.skillsHeader2 || '');
    formData.append('skills1', JSON.stringify(this.skills1));
    formData.append('skills2', JSON.stringify(this.skills2));

    if (this.aboutPicFile) {
      formData.append('aboutPic', this.aboutPicFile);
    }

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => {
        alert('✅ About Section saved successfully!');
        this.resetForm();       // Reset after save
        this.loadAboutData();   // Reload from backend
        this.isLoading=false;
      },
      error: (err: any) => {
        console.error('❌ Failed to save about section', err);
        alert('❌ Failed to save about section');
        this.isLoading=false;
      }
    });
  }

  // ✅ Reset form
  resetForm() {
    this.about = {
      aboutQuote: '',
      aboutText: '',
      skillsHeader1: '',
      skillsHeader2: ''
    };
    this.skills1 = [''];
    this.skills2 = [''];
    this.aboutPicFile = null;
    this.aboutPicPreview = '';

    // clear file input
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) fileInput.value = '';
  }

  trackByIndex(index: number) { return index; }
}
