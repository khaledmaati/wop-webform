import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { StylesService } from '../styles.service';
import { FormRetrievalComponent } from '../form-retrieval/form-retrieval.component';

@Component({
  selector: 'app-navbar-super-user',
  templateUrl: './navbar-super-user.component.html',
  styleUrl: './navbar-super-user.component.css'
})
export class NavbarSuperUserComponent {
  
  constructor(
    public authService: AuthService,
    public stylesService: StylesService,
    public formRetrievalComponent: FormRetrievalComponent
  ){}

}
