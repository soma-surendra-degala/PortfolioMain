import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from './Components/footer/footer';
import { Header } from './Components/header/header';
import { ScrollRevealDirective } from './Directive/scroll';
import { HttpClient, HttpClientModule } from '@angular/common/http';


declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Footer,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Portfolio';
   portfolio: any = null;

  constructor(private router:Router, private http: HttpClient) {}

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
