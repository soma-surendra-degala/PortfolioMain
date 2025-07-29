import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth';  // ✅ matches auth.ts

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // canActivate(): boolean {
  //   if (this.authService.getAuthStatus()) {
  //     return true;  // allow admin
  //   } else {
  //     this.router.navigate(['/home']); // redirect if not logged in
  //     return false;
  //   }
  // }


  canActivate(): boolean {
  console.log('AuthGuard check running...');
  if (this.authService.getAuthStatus()) {
    console.log('✅ Authenticated, access allowed');
    return true;
  } else {
    console.log('❌ Not authenticated, redirecting...');
    this.router.navigate(['/home']);
    return false;
  }
}

}
