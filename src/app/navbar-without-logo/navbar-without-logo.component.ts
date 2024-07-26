import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar-without-logo',
  templateUrl: './navbar-without-logo.component.html',
  styleUrl: './navbar-without-logo.component.css'
})
export class NavbarWithoutLogoComponent {
  constructor(
    public authService: AuthService,
  ){}


}
