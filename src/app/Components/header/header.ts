import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Contact } from '../contact/contact';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterModule,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  menuOpen = false;

    toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
   constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.authService.getAuthStatus();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }


}
