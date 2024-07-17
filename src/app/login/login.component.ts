import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email!: string;
  password!: string;
  isPasswordIncorrect: boolean = false;

  constructor(public authService: AuthService) {}

  loginUser() {
    this.authService.loginUser(this.email, this.password);
  }

}
