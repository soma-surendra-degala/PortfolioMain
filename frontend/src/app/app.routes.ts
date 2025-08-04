import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { About } from './Components/about/about';
import { Projects } from './Components/projects/projects';
import { Experience } from './Components/experience/experience';
import { Contact } from './Components/contact/contact';
import { Admin } from './Components/admin/admin';
import { AuthGuard } from './Guard/auth-guard';
import { Login } from './Components/login/login';
import { AdminPersonal } from './admin/personal/personal';
import { AdminAbout } from './admin/about/about';
import { AdminProjects } from './admin/projects/projects';
import { AdminExperiences } from './admin/experiences/experiences';


export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:"full"},
    {path:'home',component:Home, title: 'Home | Portfolio'},
    {path:'about',component:About, title: 'About | Portfolio'},
    {path:'projects',component:Projects, title: 'Projects | Portfolio'},
    {path:'experience',component:Experience, title: 'Experience | Portfolio'},
    {path:'contact',component:Contact, title: 'Contact | Portfolio'},
      {
        path: 'admin',
        component: Admin,
        canActivate: [AuthGuard],
        children: [
          { path: 'personal', component: AdminPersonal },
          { path: 'about', component: AdminAbout },
          { path: 'projects', component: AdminProjects },
          { path: 'experiences', component: AdminExperiences },
          { path: '', redirectTo: 'personal', pathMatch: 'full' }
        ]
      },
    {path:'login',component:Login,title:'Login | Portfolio'},
    {path:'**',redirectTo:'home',pathMatch:'full'}
];
