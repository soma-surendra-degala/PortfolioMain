import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '1234') {
      this.isLoggedIn = true;
      localStorage.setItem('auth', 'true'); // persist login
      return true;
    }
    this.isLoggedIn = false;
    localStorage.removeItem('auth');
    return false;
  }

  getAuthStatus(): boolean {
    return localStorage.getItem('auth') === 'true';
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('auth');
  }
}
