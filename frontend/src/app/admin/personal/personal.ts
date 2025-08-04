import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../Services/portfolio';

@Component({
  selector: 'app-admin-personal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './personal.html',
  styleUrls: ['./personal.css']
})
export class AdminPersonal implements OnInit {
  header: any = {
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    resume: '',
    profilePic: '',
    email: '',
    linkedin: '',
    github: '',
    instagram: '',
    twitter: '',
    whatsapp: ''
  };

  profilePicFile: File | null = null;
  profilePicPreview: string = '';
  resumeFile: File | null = null;
  skills: string[] = ['', '', '', ''];

  // Social media fields
  socialLinks = [
    { key: 'email', icon: 'envelope', type: 'email', placeholder: 'your@email.com' },
    { key: 'linkedin', icon: 'linkedin', type: 'url', placeholder: 'LinkedIn URL' },
    { key: 'github', icon: 'github', type: 'url', placeholder: 'GitHub URL' },
    { key: 'instagram', icon: 'instagram', type: 'url', placeholder: 'Instagram URL' },
    { key: 'twitter', icon: 'twitter', type: 'url', placeholder: 'Twitter URL' },
    { key: 'whatsapp', icon: 'whatsapp', type: 'text', placeholder: '+91-XXXXXXXXXX' }
  ];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.loadPersonalData();
  }

  // Fetch personal data from backend
  loadPersonalData() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.header = { ...this.header, ...data };
        this.skills = data.skills && data.skills.length ? data.skills : ['', '', '', ''];
        if (data.profilePic) this.profilePicPreview = data.profilePic;
      },
      error: (err) => console.error('❌ Failed to load personal data', err)
    });
  }

  // Handle File Selection
  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'profilePic') {
      this.profilePicFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.profilePicPreview = e.target?.result as string);
      reader.readAsDataURL(file);
    }

    if (type === 'resume') {
      this.resumeFile = file;
    }
  }

  // Helpers for social links
  getValue(key: string): string {
    return this.header[key] || '';
  }

  setValue(key: string, value: string) {
    this.header[key] = value;
  }

  // Save Portfolio
  onSave() {
    const formData = new FormData();

    formData.append('header', JSON.stringify(this.header));
    formData.append('skills', JSON.stringify(this.skills));

    if (this.profilePicFile) formData.append('profilePic', this.profilePicFile);
    if (this.resumeFile) formData.append('resume', this.resumeFile);

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => alert('✅ Personal Data saved successfully!'),
      error: (err) => {
        console.error('❌ Failed to save personal', err);
        alert('❌ Failed to save personal');
      }
    });
  }

  trackByIndex(index: number) {
    return index;
  }
}
