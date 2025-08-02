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
  home: any = null;
  loading: boolean = true;
  skills: string[] = [];
  apiUrl = 'https://portfoliomain-sbsy.onrender.com'; // ✅ Replace with your Render backend URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const sectionId = params['scrollTo'];
      if (sectionId) {
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
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
    });

    // ✅ Load portfolio data
    this.http.get(`${this.apiUrl}/`).subscribe({
      next: (data: any) => {
        this.home = data;
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
    setTimeout(() => {
      this.animate = true;
    }, 200);
  }

  scrollToProjects() {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getValidUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : 'https://' + url;
  }
}
