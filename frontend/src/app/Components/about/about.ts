import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../Directive/scroll';
import { Portfolio } from '../../Services/portfolio';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements OnInit {
  animate = false;
  header: any = {};
  skills1: string[] = [];
  skills2: string[] = [];
  aboutPic = '';

  constructor(private portfolioService: Portfolio) {}

  ngOnInit(): void {
    setTimeout(() => (this.animate = true), 500);

    // Fetch data from backend
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.header = data || {};
        this.skills1 = data.skills1 || [];
        this.skills2 = data.skills2 || [];
        this.aboutPic = data.aboutPic
          ? `http://localhost:5000${data.aboutPic}`
          : '';
      },
      error: (err) => console.error('❌ Failed to load About section', err)
    });
  }
}

