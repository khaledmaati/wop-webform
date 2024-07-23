import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { environment } from '../environments/environment';


import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { FormComponent } from './form/form.component';
import { ListingComponent } from './listing/listing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormRetrievalComponent } from './form-retrieval/form-retrieval.component';
import { DataTableComponent } from './data-table/data-table.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ListingComponent,
    LoginComponent,
    RegisterComponent,
    FormRetrievalComponent,
    DataTableComponent,
    NavbarComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    // ** Google Firebase Modules **
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}



