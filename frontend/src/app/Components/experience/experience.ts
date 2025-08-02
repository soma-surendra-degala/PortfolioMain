import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../Directive/scroll';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule,ScrollRevealDirective],
  templateUrl: './experience.html',
  styleUrls: ['./experience.css']
})
export class Experience implements OnInit {
  education: any[] = [];
  experiences: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5000/').subscribe({
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
