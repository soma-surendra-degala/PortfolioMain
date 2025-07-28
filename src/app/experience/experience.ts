import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../scroll';

@Component({
  selector: 'app-experience',
  imports: [CommonModule,ScrollRevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class Experience {
   experiences = [
    {
      role: 'Inter - Frontend Developer',
      company: 'SimulEduco Solutions',
<<<<<<< HEAD
      duration: 'July 2025 - Present',
=======
      duration: 'Jun 2025 - Present',
>>>>>>> 6c71592c5d2bd5fdc12de3fe6abf23e57a7a5333
      description: 'Worked on building responsive web apps using Angular and Bootstrap.'
    },]
     education = [
    {
      degree: 'B.E. in Computer Science',
      institution: 'Siddharth Institute of Engineering & Technology, Puttur',
<<<<<<< HEAD
      duration: 'Dec 2021 - May 2025',
      description: 'Studied Software Engineering and Full-stack development.'
=======
      duration: '2021 - 2025',
      description: 'Studied software engineering and full-stack development.'
>>>>>>> 6c71592c5d2bd5fdc12de3fe6abf23e57a7a5333
    },
    {
      degree: 'Intermediate (MPC)',
      institution: 'Narayana Junior College,Poranki',
<<<<<<< HEAD
      duration: 'June 2019 - June 2021',
      description: 'Focused on Mathematics, Physics, and Chemisrty.'
=======
      duration: '2019 - 2021',
      description: 'Focused on mathematics, physics, and chemisrty.'
>>>>>>> 6c71592c5d2bd5fdc12de3fe6abf23e57a7a5333
    }
  ];

}
