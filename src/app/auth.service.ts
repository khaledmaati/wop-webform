import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


interface UserDocument {
  role: string;
  taxID: string; // Add taxID to the UserDocument interface

}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async sendVerificationEmail(email: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      return user.sendEmailVerification();
    } else {
      throw new Error('User not logged in');
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const uid = result.user?.uid;
      if (uid) {
        const role = await this.getUserRole(uid);
        this.navigateBasedOnRole(role);
      }
    } catch (error) {
      console.error('Login error', error);
      alert('Invalid email or password');
    }
  }

  async registerUser(email: string, password: string, role: string = 'user', taxID: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = result.user?.uid;
      if (uid) {
        // Save role and taxID in the Firestore document
        await this.firestore.collection('users').doc(uid).set({ role, taxID });
        this.navigateBasedOnRole(role);
      }
    } catch (error) {
      console.error('Registration error', error);
    }
  }

  async logout(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await this.afAuth.signOut();
      console.log('logged out');
      this.router.navigate(['']);
    } catch (error) {
      console.error('Logout error', error);
    }
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  private async getUserRole(uid: string): Promise<string> {
    const doc = await this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .toPromise();
    if (doc && doc.exists) {
      // Check if 'doc' is not undefined and exists
      const userData = doc.data() as UserDocument; // Cast to UserDocument
      return userData.role || 'user'; // Now TypeScript knows about the 'role' property
    } else {
      // Handle the case where 'doc' is undefined or the document does not exist
      // For example, return a default role or throw an error
      return 'user'; // Returning 'user' as a default role
    }
  }


  public async getUserTaxID(uid: string): Promise<string> {
    const doc = await this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .toPromise();
    if (doc && doc.exists) {
      // Check if 'doc' is not undefined and exists
      const userData = doc.data() as UserDocument; // Cast to UserDocument
      return userData.taxID || 'user'; // Now TypeScript knows about the 'taxID' property
    } else {
      // Handle the case where 'doc' is undefined or the document does not exist
      // For example, return a default role or throw an error
      return 'user'; // Returning 'user' as a default role
    }
  }

  

  private navigateBasedOnRole(role: string) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/download-form']);
        break;
      case 'user':
      default:
        this.router.navigate(['/data-table']);
        break;
    }
  }
}
