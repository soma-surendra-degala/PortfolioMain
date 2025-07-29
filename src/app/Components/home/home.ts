import { Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { About } from '../about/about';
import { Projects } from '../projects/projects';
import { Contact } from '../contact/contact';
import { CommonModule } from '@angular/common';
import { Experience } from '../experience/experience';
import { ScrollRevealDirective } from '../../scroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbModule, CommonModule, About, Projects, Experience, Contact, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit {
  animate: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const sectionId = params['scrollTo'];
      if (sectionId) {
        // Delay scroll to allow DOM to render
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }

            // Remove query params from URL without reloading
            this.ngZone.run(() => {
              this.router.navigate([], {
                queryParams: {},
                replaceUrl: true,
                relativeTo: this.route,
              });
            });

          }, 100); // short delay for DOM ready
        });
      }
    });
  }

  ngAfterViewInit(): void {
    // trigger h1 animation after component loads
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
