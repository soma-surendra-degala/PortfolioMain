import { Component } from '@angular/core';
import { AdminAbout } from '../about/about';
import { AdminExperiences } from '../experiences/experiences';
import { AdminProjects } from '../projects/projects';
import { AdminPersonal } from '../personal/personal';
import { Loader } from '../../Components/loader/loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  imports: [AdminPersonal,AdminAbout,AdminExperiences,AdminProjects,Loader,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class AdminHome{
  loading: boolean = true;

    ngOnInit() {
    // Simulating API or child component data fetch
    setTimeout(() => {
      this.loading = false; // hide loader after data loads
    }, 2000); // 2 seconds loader
  }

}
