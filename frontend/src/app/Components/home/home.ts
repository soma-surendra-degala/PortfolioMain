import { Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { About } from '../about/about';
import { Projects } from '../projects/projects';
import { Contact } from '../contact/contact';
import { CommonModule } from '@angular/common';
import { Experience } from '../experience/experience';
import { ScrollRevealDirective } from '../../Directive/scroll';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbModule,
    CommonModule,
    About,
    Projects,
    Experience,
    Contact,
    ScrollRevealDirective,
    HttpClientModule,
    Loader
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit {
  animate: boolean = false;
  header: any = null;
  loading: boolean = true;
  skills: string[] = [];
  apiUrl = 'https://portfoliomain-sbsy.onrender.com'; // ✅ Your backend base URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Scroll to section if query param is set
    this.route.queryParams.subscribe(params => {
      const sectionId = params['scrollTo'];
      if (sectionId) {
        this.scrollAfterInit(sectionId);
      }
    });

    // ✅ Load portfolio data
    this.http.get(`${this.apiUrl}/`).subscribe({
      next: (data: any) => {
        // Assuming your backend sends a portfolio object
        this.header = data;
        this.skills = data.skills || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load portfolio data', err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => (this.animate = true), 200);
  }

  // ✅ Scroll after the view is ready
  private scrollAfterInit(sectionId: string) {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        // Remove query param from URL
        this.ngZone.run(() => {
          this.router.navigate([], {
            queryParams: {},
            replaceUrl: true,
            relativeTo: this.route,
          });
        });
      }, 100);
    });
  }

  // Manual scroll to projects section
  scrollToProjects() {
    this.scrollToSection('projects');
  }

  // Scroll to any section
  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Ensure URL starts with http/https
  getValidUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  }
}
