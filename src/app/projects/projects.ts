import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../scroll';

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
<<<<<<< HEAD
    github: 'https://github.com/soma-surendra-degala/Portfolio',
    live: 'https://sdportfoli.netlify.app/',
    screenshot: 'assets/Portfolio.png'
=======
    github: 'https://github.com/your-portfolio',
    live: 'https://your-portfolio.netlify.app',
    screenshot: 'assets/Portfolio.png' // <-- add this
>>>>>>> 6c71592c5d2bd5fdc12de3fe6abf23e57a7a5333
  },
  {
    title: 'Recipe Hub',
    type: 'Web App',
    description: 'Developed for managing and discovering over 10000 recipes',
    techStack: ['React.js', 'Bootstrap', 'Node.js', 'Express.js', 'MongoDB'],
<<<<<<< HEAD
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
=======
    github: 'https://github.com/your-username/recipe-hub',
    live: 'https://recipehub.netlify.app',
    screenshot: 'assets/02.png' // <-- add this
  },{
  title: 'LocalSports',
  type: 'Web App',
  description: 'A platform to explore and manage local sports events and teams.',
  techStack: ['React.js', 'MongoDb', 'Node.js', 'Express.js'],
  github: 'https://github.com/soma-surendra-degala/Local_Sports',
  live: 'https://localsports.netlify.app',
  screenshot: 'assets/localsports.png'
},{
  title: 'Web Stories',
  type: 'Web App',
  description: 'An engaging platform built with React.js for creating and viewing immersive web-based stories.',
>>>>>>> 6c71592c5d2bd5fdc12de3fe6abf23e57a7a5333
  techStack: ['React.js', 'MongoDb', 'Node.js', 'Express.js'],
  github: 'https://github.com/soma-surendra-degala/WebStories',
  live: 'https://web-stories-theta.vercel.app/',
  screenshot: 'assets/WebStories.png'
}

];


}
