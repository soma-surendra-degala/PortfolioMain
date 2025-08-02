import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../Directive/scroll';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './experience.html',
  styleUrls: ['./experience.css']
})
export class Experience implements OnInit {
  education: any[] = [];
  experiences: any[] = [];

  // ✅ Use your deployed backend instead of localhost
  private apiUrl = 'https://portfoliomain-sbsy.onrender.com';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`${this.apiUrl}/`).subscribe({
      next: (data: any) => {
        this.education = data.education || [];
        this.experiences = data.experiences || [];
      },
      error: (err) => {
        console.error('❌ Failed to load experience data', err);
      }
    });
  }
}
