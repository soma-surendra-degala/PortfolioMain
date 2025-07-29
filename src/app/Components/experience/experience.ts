import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../Directive/scroll';



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
      duration: 'July 2025 - Present',
      description: 'Worked on building responsive web apps using Angular and Bootstrap.'
    },]
     education = [
    {
      degree: 'B.E. in Computer Science',
      institution: 'Siddharth Institute of Engineering & Technology, Puttur',
      duration: 'Dec 2021 - May 2025',
      description: 'Studied Software Engineering and Full-stack development.'
    },
    {
      degree: 'Intermediate (MPC)',
      institution: 'Narayana Junior College,Poranki',
      duration: 'June 2019 - June 2021',
      description: 'Focused on Mathematics, Physics, and Chemisrty.'
    }
  ];

}
