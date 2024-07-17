import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import components and guards in a grouped and sorted manner
import { AuthGuard } from './auth.guard';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormSentNotificationComponent } from './form-sent-notification/form-sent-notification.component';
import { FormRetrievalComponent } from './form-retrieval/form-retrieval.component';

// Define routes
const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'form', component: FormComponent, canActivate: [AuthGuard] }, // Protect form page with AuthGuard
  { path: 'register', component: RegisterComponent },
  { path: 'form-sent-notification', component: FormSentNotificationComponent, canActivate: [AuthGuard] },
  { path: 'download-form', component:  FormRetrievalComponent, canActivate: [AuthGuard] }
];

// Use consistent formatting for decorators
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}