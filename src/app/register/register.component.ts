import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email!: string;
  password!: string;
  taxID!: string;

  constructor(private authService: AuthService) {}

  registerUser() {
    this.authService.registerUser(this.email, this.password, 'user', this.taxID );
  }
}


