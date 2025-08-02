import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../Directive/scroll';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, ScrollRevealDirective],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit {
  portfolio: any = null;

  // ✅ Form model
  formData = {
    name: '',
    email: '',
    message: ''
  };

  contactHighlights: any[] = [];

  // ✅ Use your deployed backend instead of localhost
  private apiUrl = 'https://portfoliomain-sbsy.onrender.com';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`${this.apiUrl}/`).subscribe({
      next: (data: any) => {
        this.portfolio = data;
        this.contactHighlights = data.contactHighlights || [];
      },
      error: (err) => {
        console.error('❌ Failed to load portfolio data', err);
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      alert('⚠️ Please fill in all fields.');
      return;
    }

    this.http.post(`${this.apiUrl}/contact`, this.formData).subscribe({
      next: () => {
        alert('✅ Message sent successfully!');
        this.formData = { name: '', email: '', message: '' }; // Reset form
      },
      error: (err) => {
        console.error('❌ Failed to send message', err);
        alert('❌ Failed to send message. Please try again later.');
      }
    });
  }
}
