import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { ScrollRevealDirective } from './scroll';
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Portfolio';
  

  constructor(private router: Router) {}
   ngAfterViewInit(): void {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => {
      new bootstrap.Tooltip(el);
    });
  }

  goToSection(section: string) {
    this.router.navigate(['/'], { queryParams: { scrollTo: section } });
  }
}
