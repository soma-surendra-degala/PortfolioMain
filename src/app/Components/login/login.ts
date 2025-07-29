import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports:[FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const success = this.authService.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/admin']);
    } else {
      alert('Invalid Credentials!');
      this.router.navigate(['/home']);
    }
  }
}
