import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../Directive/scroll';

@Component({
  selector: 'app-contact',
  imports:[FormsModule,CommonModule,ScrollRevealDirective],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit {
  portfolio: any = null;

  // Form model
  formData = {
    name: '',
    email: '',
    message: ''
  };

  contactHighlights: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5000/').subscribe({
      next: (data: any) => {
        this.portfolio = data;

        if (data.contactHighlights && data.contactHighlights.length > 0) {
          this.contactHighlights = data.contactHighlights;
        }
      },
      error: (err) => {
        console.error('❌ Failed to load portfolio data', err);
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    // Send form data to backend (adjust endpoint)
    this.http.post('http://localhost:5000/contact', this.formData).subscribe({
      next: () => {
        alert('✅ Message sent successfully!');
        this.formData = { name: '', email: '', message: '' }; // reset form
      },
      error: (err) => {
        console.error('❌ Failed to send message', err);
        alert('❌ Failed to send message. Please try again later.');
      }
    });
  }
}
