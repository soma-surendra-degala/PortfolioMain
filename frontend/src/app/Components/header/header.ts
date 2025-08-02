import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  menuOpen = false;
  portfolio: any = null;

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5000/').subscribe({
      next: (data: any) => {
        this.portfolio = data;
      },
      error: (err) => {
        console.error('❌ Failed to load portfolio data', err);
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
