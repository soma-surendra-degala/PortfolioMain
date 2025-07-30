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
import { Loader } from '../loader/loader'; // ✅ import loader

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
    Loader // ✅ add loader
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit {
  animate: boolean = false;
  home: any = null;
  loading: boolean = true; // ✅ add loader state

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

    // ✅ Load header data
    this.http.get('http://localhost:5000/home').subscribe({
      next: (data) => {
        this.home = data;
        this.loading = false; // ✅ hide loader after data load
      },
      error: (err) => {
        console.error('❌ Failed to load home data', err);
        this.loading = false; // even on error, hide loader
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.animate = true;
    }, 200);
  }

  scrollToProjects() {
    this.router.navigate(['projects']);
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
