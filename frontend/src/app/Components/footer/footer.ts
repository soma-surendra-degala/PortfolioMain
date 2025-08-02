import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports:[CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer implements OnInit {
  portfolio: any = null;
  currentYear: number = new Date().getFullYear();

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5000/').subscribe({
      next: (data: any) => {
        this.portfolio = data?.header || {};
        this.startTypewriter(this.portfolio.aboutQuote || '"Code. Create. Inspire."');
      },
      error: (err) => {
        console.error('❌ Failed to load footer data', err);
        this.startTypewriter('"Code. Create. Inspire."');
      }
    });
  }

  startTypewriter(text: string) {
    const element = document.getElementById('footer-tagline');
    let index = 0;
    let deleting = false;

    setInterval(() => {
      if (element) {
        if (!deleting && index <= text.length) {
          element.textContent = text.substring(0, index++);
        } else if (deleting && index >= 0) {
          element.textContent = text.substring(0, index--);
        }

        if (index > text.length) {
          deleting = true;
          index = text.length;
        } else if (index < 0) {
          deleting = false;
          index = 0;
        }
      }
    }, 120);
  }

  logout() {
    this.router.navigate(['/']); // Go home
  }
}
