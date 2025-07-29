import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from './Components/footer/footer';
import { Header } from './Components/header/header';
import { ScrollRevealDirective } from './Directive/scroll';


declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Footer,ScrollRevealDirective],
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
