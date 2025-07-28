import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Projects } from './projects/projects';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Experience } from './experience/experience';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:"full"},
    {path:'home',component:Home, title: 'Home | Portfolio'},
    {path:'about',component:About, title: 'About | Portfolio'},
    {path:'projects',component:Projects, title: 'Projects | Portfolio'},
    {path:'experience',component:Experience, title: 'Experience | Portfolio'},
    {path:'contact',component:Contact, title: 'Contact | Portfolio'},
    {path:'**',redirectTo:'home',pathMatch:'full'}
];
