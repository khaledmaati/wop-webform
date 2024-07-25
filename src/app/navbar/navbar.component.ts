import { Component, input } from '@angular/core';
import { AuthService } from '../auth.service';
import { StylesService } from '../styles.service';
import { FormComponent } from '../form/form.component';


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
