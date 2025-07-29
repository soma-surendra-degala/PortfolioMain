import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { About } from './Components/about/about';
import { Projects } from './Components/projects/projects';
import { Experience } from './Components/experience/experience';
import { Contact } from './Components/contact/contact';
import { Admin } from './Components/admin/admin';
import { AuthGuard } from './Guard/auth-guard';
import { Login } from './Components/login/login';


export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:"full"},
    {path:'home',component:Home, title: 'Home | Portfolio'},
    {path:'about',component:About, title: 'About | Portfolio'},
    {path:'projects',component:Projects, title: 'Projects | Portfolio'},
    {path:'experience',component:Experience, title: 'Experience | Portfolio'},
    {path:'contact',component:Contact, title: 'Contact | Portfolio'},
    {path:'admin',component:Admin,title:'Admin | Portfolio',canActivate: [AuthGuard]},
    {path:'login',component:Login,title:'Login | Portfolio'},
    {path:'**',redirectTo:'home',pathMatch:'full'}
];
