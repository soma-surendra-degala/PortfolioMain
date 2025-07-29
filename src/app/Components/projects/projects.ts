import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../scroll';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
 projects = [
  {
    title: 'Portfolio Website',
    type: 'Web App',
    description: 'A personal portfolio to showcase projects...',
    techStack: ['Angular', 'Bootstrap', 'HTML', 'CSS'],
    github: 'https://github.com/soma-surendra-degala/Portfolio',
    live: 'https://sdportfoli.netlify.app/',
    screenshot: 'assets/Portfolio.png'
  },
  {
    title: 'Recipe Hub',
    type: 'Web App',
    description: 'Developed for managing and discovering over 10000 recipes',
    techStack: ['React.js', 'Bootstrap', 'Node.js', 'Express.js', 'MongoDB'],
    github: 'https://github.com/soma-surendra-degala/ReceipeHub',
    screenshot: 'assets/ReceipeHub.png'
  },{
  title: 'Local Sports',
  type: 'Web App',
  description: 'A platform to explore sports events and teams.',
  techStack: ['React.js', 'MongoDb', 'Node.js', 'Express.js'],
  github: 'https://github.com/soma-surendra-degala/Local_Sports',
  screenshot: 'assets/LocalSports.png'
},{
  title: 'Web Stories',
  type: 'Web App',
  description: 'A platform delivering fast, swipe‑friendly visual experiences.',

  techStack: ['React.js', 'MongoDb', 'Node.js', 'Express.js'],
  github: 'https://github.com/soma-surendra-degala/WebStories',
  live: 'https://webstories-frontend.onrender.com/',
  screenshot: 'assets/WebStories.png'
}

];


}
