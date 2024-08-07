import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import components and guards in a grouped and sorted manner
import { AuthGuard } from './auth.guard';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormRetrievalComponent } from './form-retrieval/form-retrieval.component';
import { DataTableComponent } from './data-table/data-table.component';
import { SubmitConfirmationComponent } from './submit-confirmation/submit-confirmation.component';

// Define routes
const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'form', component: FormComponent, canActivate: [AuthGuard] },  // For navigating without uid
  { path: 'form/:uid/:jahr', component: FormComponent, canActivate: [AuthGuard] },  // For navigating with uid and year
  { path: 'register', component: RegisterComponent },
  { path: 'form-sent-notification', component: SubmitConfirmationComponent, canActivate: [AuthGuard] },
  { path: 'download-form', component:  FormRetrievalComponent, canActivate: [AuthGuard] },
  { path: 'data-table', component:  DataTableComponent, canActivate: [AuthGuard] }
];

// Use consistent formatting for decorators
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}