import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormComponent } from '../form/form.component';
import { StylesService } from '../styles.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    public authService: AuthService,
    public stylesService: StylesService,
    public formComponent: FormComponent
  ) {}

}
