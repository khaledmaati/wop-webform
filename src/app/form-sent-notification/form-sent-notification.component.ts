import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-form-sent-notification',
  templateUrl: './form-sent-notification.component.html',
  styleUrl: './form-sent-notification.component.css',
})
export class FormSentNotificationComponent {
  constructor(public authService: AuthService) {}
}
