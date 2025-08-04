import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() {
  this.logout();
}

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('authTime', Date.now().toString());
      return true;
    }
    this.logout();
    return false;
  }

  getAuthStatus(): boolean {
  const auth = localStorage.getItem('auth');
  const authTime = localStorage.getItem('authTime');

  console.log('Auth check:', auth, authTime);
  

  if (auth === 'true' && authTime) {
    const now = Date.now();
    const diff = now - parseInt(authTime, 10);

    // expire after 30 mins
    if (diff < 30 * 60 * 1000) {
      return true;
    } else {
      console.log("⏰ Session expired, logging out");
      this.logout();
    }
  }
  return false;
}

  logout(): void {
    localStorage.removeItem('auth');
    localStorage.removeItem('authTime');
  }
}
