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
  profilePicPreview: string | ArrayBuffer | null = null;
  resumeFile: File | null = null;
  profilePicFile: File | null = null;

 header = {
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    resume: '',
    email: '',
    linkedin: '',
    github: '',
    instagram: '',
    twitter: '',
    whatsapp: ''
  };

  socialLinks = [
    { icon: 'envelope', key: 'email', type: 'email', placeholder: 'your@email.com' },
    { icon: 'linkedin', key: 'linkedin', type: 'url', placeholder: 'LinkedIn URL' },
    { icon: 'github', key: 'github', type: 'url', placeholder: 'GitHub URL' },
    { icon: 'instagram', key: 'instagram', type: 'url', placeholder: 'Instagram URL' },
    { icon: 'twitter', key: 'twitter', type: 'url', placeholder: 'Twitter URL' },
    { icon: 'whatsapp', key: 'whatsapp', type: 'text', placeholder: '+91-XXXXXXXXXX' }
  ];

  // Getter
  getValue(field: string) {
    return (this.header as any)[field] || '';
  }

  // Setter
  setValue(field: string, value: string) {
    (this.header as any)[field] = value;
  }
  // Skills
  skills: string[] = ['', '', '', ''];

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    this.fetchPersonal();
  }

  fetchPersonal() {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        if (data) {
          this.header.firstName = data.firstName || '';
          this.header.middleName = data.middleName || '';
          this.header.lastName = data.lastName || '';
          this.header.role = data.role || '';
          this.header.resume = data.resume || '';
          this.skills = data.skills?.length ? data.skills : this.skills;

          if (data.profilePic) {
            this.profilePicPreview = data.profilePic;
          }
        }
      },
      error: (err) => console.error('❌ Failed to load personal info', err)
    });
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'resume') {
      this.resumeFile = file;
    }

    if (type === 'profilePic') {
      this.profilePicFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.profilePicPreview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  addSkill() { this.skills.push(''); }
  removeSkill(index: number) {
    if (this.skills.length > 1) this.skills.splice(index, 1);
  }

  onSave() {
    const formData = new FormData();
    formData.append('header', JSON.stringify(this.header));
    formData.append('skills', JSON.stringify(this.skills));

    if (this.resumeFile) formData.append('resume', this.resumeFile);
    if (this.profilePicFile) formData.append('profilePic', this.profilePicFile);

    this.portfolioService.savePortfolio(formData).subscribe({
      next: () => alert('✅ Personal info saved successfully'),
      error: (err) => {
        console.error('❌ Failed to save personal info', err);
        alert('❌ Failed to save personal info');
      }
    });
  }

  trackByIndex(index: number) {
    return index;
  }
}


// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-admin-personal',
//   imports:[FormsModule,CommonModule],
//   templateUrl: './personal.html',
//   styleUrls: ['./personal.css']
// })
// export class AdminPersonal implements OnInit {

//   header: any = {
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     role: '',
//     resume: '',
//     profilePic: '',
//     // --- Social Media Links ---
//     email: '',
//     linkedin: '',
//     github: '',
//     instagram: '',
//     twitter: '',
//     whatsapp: ''
//   };

//   skills: string[] = [''];
//   profilePicPreview: string | null = null;
//   resumeFile: File | null = null;

//   isHomePage = false;

//   constructor(private router: Router) {}

//   ngOnInit() {
//     this.isHomePage = this.router.url === '/home';
//   }

//   // File select handler
//   onFileSelected(event: any, type: string) {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (type === 'profilePic') {
//       this.header.profilePic = file;
//       const reader = new FileReader();
//       reader.onload = e => this.profilePicPreview = reader.result as string;
//       reader.readAsDataURL(file);
//     } else if (type === 'resume') {
//       this.resumeFile = file;
//       this.header.resume = file.name; // store file name or upload to server
//     }
//   }

//   savePersonal() {
//     // This would send data to your backend
//     console.log('Saving personal info:', this.header);
//     alert('✅ Personal data saved!');
//   }

//   trackByIndex(index: number): any {
//     return index;
//   }
// }

